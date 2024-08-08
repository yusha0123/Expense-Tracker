import { useForm } from "react-hook-form";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import useModalStore, { modalTypes } from "../hooks/useModalStore";

const Login = () => {
  const login = useLogin();
  const loginForm = useForm();
  const [showPass, setShowPass] = useState(false);
  const { onOpen } = useModalStore();

  const handleLogin = (data) => {
    login.mutate(data);
  };

  return (
    <form onSubmit={loginForm.handleSubmit(handleLogin)}>
      <Stack spacing={1}>
        {login.isError && (
          <Alert status="error" rounded={5}>
            <AlertIcon />
            <AlertTitle>
              {login.error?.response?.data?.message
                ? login.error.response.data.message
                : "Something went wrong!"}
            </AlertTitle>
          </Alert>
        )}
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            autoComplete="off"
            {...loginForm.register("email")}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              autoComplete="off"
              {...loginForm.register("password")}
            />
            <InputRightElement h={"full"}>
              <Button
                variant={"ghost"}
                onClick={() => setShowPass((prev) => !prev)}
              >
                {showPass ? (
                  <Icon as={BiSolidHide} />
                ) : (
                  <Icon as={BiSolidShow} />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="teal"
          variant="link"
          onClick={() => onOpen(modalTypes.RESET_PASSWORD_MODAL)}
          size={{
            base: "sm",
            xl: "md",
          }}
        >
          Forgot Password ?
        </Button>
        <Button
          colorScheme="messenger"
          type="submit"
          mt={2}
          isLoading={login.isPending}
          loadingText="Please wait..."
        >
          Continue
        </Button>
      </Stack>
    </form>
  );
};

export default Login;
