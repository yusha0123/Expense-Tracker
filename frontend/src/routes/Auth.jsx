import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  InputGroup,
  InputRightElement,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  ScaleFade,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { useLogin } from "../hooks/useLogin";
import Logo from "../components/Logo";

const Auth = () => {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const modalSize = useBreakpointValue({ base: "sm", md: "md", xl: "lg" });
  const loginForm = useForm();
  const signUpForm = useForm();
  const resetPass = useForm();
  const login = useLogin();
  const signUp = useSignup();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activateLoginPanel = queryParams.get("action") === "login";

  const handleSignup = (data) => {
    signUp.mutate(data);
  };

  const handleLogin = (data) => {
    login.mutate(data);
  };

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
    <>
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.200">
        <Box
          rounded={"lg"}
          bg="white"
          boxShadow={"lg"}
          py={8}
          px={5}
          maxW={{
            sm: "400px",
            xl: "576px",
          }}
          minW={{
            lg: "350px",
          }}
          w={["90%", "80%", "50%", "30%"]}
        >
          <ScaleFade initialScale={0.7} in={true}>
            <Tabs
              isFitted
              variant="soft-rounded"
              colorScheme="green"
              defaultIndex={activateLoginPanel ? 1 : 0}
            >
              <TabList mb={"1em"}>
                <Tab>Sign Up</Tab>
                <Tab>Login</Tab>
              </TabList>
              <Divider
                orientation="horizontal"
                borderWidth="3px"
                rounded={"lg"}
              />
              <TabPanels>
                <TabPanel>
                  {/* Signup Panel */}
                  <form onSubmit={signUpForm.handleSubmit(handleSignup)}>
                    <Stack spacing={1}>
                      {signUp.isError && (
                        <Alert status="error" rounded={5}>
                          <AlertIcon />
                          <AlertTitle>
                            {signUp.error?.response?.data?.message
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
                            type={showPass1 ? "text" : "password"}
                            autoComplete="off"
                            {...signUpForm.register("password")}
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
                </TabPanel>
                <TabPanel>
                  {/* Login Panel */}
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
                            type={showPass2 ? "text" : "password"}
                            autoComplete="off"
                            {...loginForm.register("password")}
                          />
                          <InputRightElement h={"full"}>
                            <Button
                              variant={"ghost"}
                              onClick={() => setShowPass2((prev) => !prev)}
                            >
                              {showPass2 ? (
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
                        onClick={onOpen}
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
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ScaleFade>
        </Box>
      </Flex>
      {/* Reset password Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
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
    </>
  );
};

export default Auth;
