import useOverlayStore, { ExpensePayload } from "@/hooks/useOverlayStore";
import useUpdateExpense from "@/hooks/useUpdateExpense";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Input,
    Select,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
    amount: number;
    category: string;
    description: string;
};

const EditExpenseDialog = () => {
    const { isOpen, onClose, type, data } = useOverlayStore();
    const overlayData = data as ExpensePayload;
    const cancelRef = useRef(null);
    const updateExpense = useUpdateExpense();

    const { register, handleSubmit, reset } = useForm<FormValues>();

    useEffect(() => {
        if (overlayData && type === "EDIT_DIALOG") {
            reset({
                amount: overlayData?.amount,
                category: overlayData.category,
                description: overlayData.description,
            });
        }
    }, [overlayData, type, reset]);

    const onSubmit = (values: FormValues) => {
        if (!overlayData?._id) return;
        updateExpense.mutate(
            { _id: overlayData._id, ...values },
            { onSuccess: onClose }
        );
    };

    return (
        <AlertDialog
            isOpen={isOpen && type === "EDIT_DIALOG"}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="xl" fontWeight="bold" textAlign={"center"}>
                        Edit Expense
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <VStack spacing={3}>
                            <Input
                                type="number"
                                placeholder="Amount"
                                {...register("amount", { required: true })}
                            />

                            <Select
                                placeholder="Select Category"
                                {...register("category", { required: true })}
                            >
                                <option value="Mobile & Computers">Mobile & Computers</option>
                                <option value="Books & Education">Books & Education</option>
                                <option value="Sports, Outdoor & Travel">
                                    Sports, Outdoor & Travel
                                </option>
                                <option value="Bills & EMI's">Bills & EMI&apos;s</option>
                                <option value="Groceries & Pet Supplies">
                                    Groceries & Pet Supplies
                                </option>
                                <option value="Fashion & Beauty">Fashion & Beauty</option>
                                <option value="Gifts & Donations">Gifts & Donations</option>
                                <option value="Investments">Investments</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Home & Utilities">Home & Utilities</option>
                                <option value="Hobbies & Leisure">Hobbies & Leisure</option>
                            </Select>

                            <Input
                                placeholder="Description"
                                {...register("description", { required: true })}
                            />
                        </VStack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="teal"
                            ml={3}
                            // isLoading={updateExpense.isPending}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default EditExpenseDialog;
