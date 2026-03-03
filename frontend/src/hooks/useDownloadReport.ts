import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Id, toast } from "react-toastify";
import { useRef } from "react";
import axiosInstance from "@/lib/axios";
import useOverlayStore from "@/hooks/useOverlayStore";
import { ReportData } from "@/types/report";

interface DownloadPayload {
    data: ReportData[];
}

export const useDownloadReport = () => {
    const toastRef = useRef<Id | null>(null);
    const queryClient = useQueryClient();
    const { isOpen } = useOverlayStore();

    return useMutation({
        mutationFn: async ({ data }: DownloadPayload) => {
            toastRef.current = toast.loading("Generating file...");

            const response = await axiosInstance.post<Blob>(
                "/premium/report/download",
                { data },
                { responseType: "blob" }
            );

            return response.data;
        },

        onSuccess: (blob) => {
            const file = new Blob([blob], { type: "text/csv" });
            const url = window.URL.createObjectURL(file);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Expensify.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            if (toastRef.current) {
                toast.update(toastRef.current, {
                    render: "File generated successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            }

            queryClient.invalidateQueries({
                queryKey: ["downloads", isOpen],
            });
        },

        onError: () => {
            if (toastRef.current) {
                toast.update(toastRef.current, {
                    render: "Failed to generate file.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        },
    });
};