import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useOverlayStore from "./useOverlayStore";

const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") ?? "1");
    const rows = JSON.parse(localStorage.getItem("rows") ?? "10");

    const { onClose } = useOverlayStore();

    return useMutation({
        mutationFn: (dataId: string) => {
            return axiosInstance.delete(`/expense/${dataId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-expenses", { currentPage, rows }],
            });
            toast.info("Expense Deleted!", { autoClose: 2000 });
        },
        onSettled: () => onClose(),
    });
};

export default useDeleteExpense;
