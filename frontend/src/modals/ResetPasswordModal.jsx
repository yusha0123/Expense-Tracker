import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useModalStore, { modalTypes } from "../hooks/useModalStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AiOutlineMail } from "react-icons/ai";

const ResetPasswordModal = () => {
  const modalSize = useBreakpointValue({ base: "sm", md: "md", xl: "lg" });
  const resetPass = useForm();
  const { isOpen, type, onClose } = useModalStore();

  const resetPassword = useMutation({
    mutationFn: (data) => {
      return axios.post("/api/auth/token", data);
    },
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error) => {
      if (error.response?.status === 404) {
        toast.error("User not found or invalid email!");
      } else {
        toast.error("Something went wrong!");
      }
    },
    onSettled: () => {
      resetPass.reset();
      onClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen && type == modalTypes.RESET_PASSWORD_MODAL}
      onClose={onClose}
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Reset Password</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <form onSubmit={resetPass.handleSubmit(resetPassword.mutate)}>
            <Stack spacing={3} alignItems="center">
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Type your response here"
                  {...resetPass.register("email")}
                />
              </FormControl>
              <Button
                rightIcon={<Icon as={AiOutlineMail} />}
                colorScheme="messenger"
                type="submit"
                isLoading={resetPassword.isPending}
                loadingText="Please wait..."
              >
                Send Email
              </Button>
            </Stack>
          </form>
        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose} mx="auto">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordModal;
