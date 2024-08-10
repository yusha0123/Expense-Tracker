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
import useModalStore from "../hooks/useOverlayStore";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AiOutlineMail } from "react-icons/ai";

const ResetPasswordModal = () => {
  const modalSize = useBreakpointValue({ base: "sm", md: "md", xl: "lg" });
  const resetPass = useForm();
  const { isOpen, type, onClose } = useModalStore();

  const resetPassword = useMutation({
    mutationFn: (formData: Record<string, unknown>) => {
      return axios.post("/api/auth/token", formData);
    },
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error: AxiosError) => {
      if (error?.response?.status === 404) {
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

  const onSubmit = (data: Record<string, unknown>) => {
    resetPassword.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen && type === "RESET_PASSWORD_MODAL"}
      onClose={onClose}
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Reset Password</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <form onSubmit={resetPass.handleSubmit(onSubmit)}>
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
