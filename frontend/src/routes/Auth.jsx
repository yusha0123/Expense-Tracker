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
  Text,
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
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { useSignup } from "../hooks/useSignup";
import { useLogin } from "../hooks/useLogin";
import Logo from "../components/Logo";

const Auth = () => {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalSize = useBreakpointValue({ base: "xs", md: "md", xl: "xl" });
  const loginForm = useForm();
  const signUpForm = useForm();
  const resetPass = useForm();
  const login = useLogin();
  const signUp = useSignup();

  const handleSignup = (data) => {
    signUp.mutate(data);
  };

  const handleLogin = (data) => {
    login.mutate(data);
  };

  const reset_Pass = (data) => {
    setLoading(true);
    axios
      .post("/api/auth/token", data)
      .then(() => {
        // showToast(
        //   toast,
        //   "Password reset mail Sent!",
        //   "success",
        //   "Don't forget to check Spam Folder."
        // );
      })
      .catch((error) => {
        console.log(error);
        showToast(toast, error.response.data.message, "error");
      })
      .finally(() => {
        setLoading(false);
        setOpenModal(false);
        resetPass.reset();
      });
  };

  return (
    <>
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.200">
        <Box position={"fixed"} top={3}>
          <Logo />
        </Box>
        <Box
          rounded={"lg"}
          bg="white"
          boxShadow={"lg"}
          py={8}
          px={5}
          w={{ base: "90%", md: "50%", lg: "30%" }}
        >
          <ScaleFade initialScale={0.7} in={true}>
            <Tabs isFitted variant="soft-rounded" colorScheme="green">
              <TabList mb={"1em"}>
                <Tab>Sign Up</Tab>
                <Tab>Login</Tab>
              </TabList>
              <Divider orientation="horizontal" borderWidth="3px" />
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
                        mt={2}
                        onClick={() => {
                          setOpenModal(true);
                        }}
                      >
                        Forgot Password ?
                      </Button>
                      <Button
                        colorScheme="messenger"
                        type="submit"
                        mt={4}
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
      <Modal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Reset Password</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <form onSubmit={resetPass.handleSubmit(reset_Pass)}>
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
                  isLoading={loading}
                  loadingText="Please wait..."
                >
                  Send Email
                </Button>
              </Stack>
            </form>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                setOpenModal(false);
              }}
              mx="auto"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Auth;
