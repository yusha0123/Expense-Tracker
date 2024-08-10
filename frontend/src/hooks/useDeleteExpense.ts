import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useError } from "../hooks/useError";
import useOverlayStore from "./useOverlayStore";

const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") ?? "1");
    const rows = JSON.parse(localStorage.getItem("rows") ?? "10");
    const {
        state: { user },
    } = useAuthContext();
    const { verify } = useError();
    const { onClose } = useOverlayStore();

    return useMutation({
        mutationFn: (dataId: string) => {
            return axios.delete(`/api/expense/${dataId}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-expenses", { currentPage, rows }],
            });
            toast.info("Expense Deleted!", { autoClose: 2000 });
        },
        onError: (error) => {
            verify(error);
        },
        onSettled: () => onClose(),
    });
};

export default useDeleteExpense;
