import { Navigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useTitle from "../hooks/useTitle";
import {
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
import Logo from "../components/Logo";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const ResetPassword = () => {
  useTitle("Expensify - Reset Password");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const resetPassForm = useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <Navigate to={"/"} />;
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
          <form onSubmit={() => {}}>
            <Stack spacing={2}>
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPass1 ? "text" : "password"}
                    autoComplete="off"
                    {...resetPassForm.register("password")}
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
                    {...resetPassForm.register("Cpassword")}
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
                // isLoading={signUp.isPending}
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
