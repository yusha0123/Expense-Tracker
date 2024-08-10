import useDeleteExpense from "@/hooks/useDeleteExpense";
import useOverlayStore from "@/hooks/useOverlayStore";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

const DeleteDialog = () => {
  const { isOpen, onClose, type, data } = useOverlayStore();
  const cancelRef = useRef(null);
  const deleteExpense = useDeleteExpense();

  return (
    <AlertDialog
      isOpen={isOpen && type === "DELETE_DIALOG"}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Expense
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              isDisabled={deleteExpense.isPending}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => deleteExpense.mutate(data!)}
              ml={3}
              isDisabled={deleteExpense.isPending}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteDialog;
