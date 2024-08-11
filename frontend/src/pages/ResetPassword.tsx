import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  ScaleFade,
  Stack,
} from "@chakra-ui/react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useTitle from "@/hooks/useTitle";
import Logo from "@/components/Logo";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { Loading } from "@/components/Loading";

const ResetPassword = () => {
  useTitle("Expensify - Reset Password");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, isValid },
  } = useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const { isPending, isError, error } = useQuery({
    queryKey: ["validate-token"],
    queryFn: async () => {
      const { data } = await axios.get("/api/auth/reset-password", {
        params: {
          token,
        },
      });
      return data;
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  const resetPass = useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      const { data } = await axios.put(
        `/api/auth/reset-password/${token}`,
        formData
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      navigate("/auth?action=login");
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    resetPass.mutate(data);
  };

  if (!token) {
    return <Navigate to={"/"} replace />;
  }

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          maxW={"450px"}
          mx={"auto"}
          w={["95%", "85%", "70%"]}
          rounded={"lg"}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {isAxiosError(error) && error.response?.data
              ? error.response.data
              : "Something went wrong!"}
          </AlertTitle>
          <AlertDescription maxWidth="sm"></AlertDescription>
        </Alert>
      </Flex>
    );
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.200">
      <Box
        rounded={"lg"}
        bg="white"
        boxShadow={"lg"}
        py={4}
        px={5}
        maxW={{
          sm: "400px",
          xl: "550px",
        }}
        minW={{
          lg: "350px",
        }}
        w={["90%", "80%", "50%", "30%"]}
      >
        <ScaleFade initialScale={0.7} in={true}>
          <Box mb={3} display={"flex"} justifyContent={"center"}>
            <Logo />
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {resetPass.isError && (
                <Alert status="error" rounded={5}>
                  <AlertIcon />
                  <AlertTitle>
                    {isAxiosError(resetPass.error) &&
                    resetPass.error.response?.data?.message
                      ? resetPass.error.response.data.message
                      : "Something went wrong!"}
                  </AlertTitle>
                </Alert>
              )}
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPass1 ? "text" : "password"}
                    autoComplete="off"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() => setShowPass1((prev) => !prev)}
                    >
                      {showPass1 ? (
                        <Icon as={BiSolidHide} />
                      ) : (
                        <Icon as={BiSolidShow} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPass2 ? "text" : "password"}
                    autoComplete="off"
                    {...register("confirmPassword", {
                      required: "Password confirmation is required",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords must match",
                    })}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() => setShowPass2((prev) => !prev)}
                    >
                      {showPass1 ? (
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
                isLoading={resetPass.isPending}
                isDisabled={!isDirty || !isValid}
                loadingText="Please wait..."
              >
                Submit
              </Button>
            </Stack>
          </form>
        </ScaleFade>
      </Box>
    </Flex>
  );
};

export default ResetPassword;
