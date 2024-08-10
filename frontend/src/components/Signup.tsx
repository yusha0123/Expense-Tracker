import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useSignup } from "../hooks/useSignup";
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
import { isAxiosError } from "axios";

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const signUpForm = useForm();
  const signUp = useSignup();

  const handleSignup = (data: FieldValues) => {
    signUp.mutate(data);
  };

  return (
    <form onSubmit={signUpForm.handleSubmit(handleSignup)}>
      <Stack spacing={1}>
        {signUp.isError && (
          <Alert status="error" rounded={5}>
            <AlertIcon />
            <AlertTitle>
              {isAxiosError(signUp.error) &&
              signUp.error?.response?.data?.message
                ? signUp.error.response.data.message
                : "Something went wrong!"}
            </AlertTitle>
          </Alert>
        )}
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            autoComplete="off"
            {...signUpForm.register("name")}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            autoComplete="off"
            {...signUpForm.register("email")}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              autoComplete="off"
              {...signUpForm.register("password")}
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
          colorScheme="messenger"
          type="submit"
          mt={4}
          isLoading={signUp.isPending}
          loadingText="Please wait..."
        >
          Create Account
        </Button>
      </Stack>
    </form>
  );
};

export default Signup;
