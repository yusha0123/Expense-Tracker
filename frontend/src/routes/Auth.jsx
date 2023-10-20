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
  useToast,
  ScaleFade,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import showToast from "../hooks/showToast";
import axios from "axios";
import { BiMoneyWithdraw } from "react-icons/bi";

const Auth = () => {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalSize = useBreakpointValue({ base: "xs", md: "md", xl: "xl" });
  const loginForm = useForm();
  const signUpForm = useForm();
  const resetPass = useForm();
  const toast = useToast();
  const {
    signUp,
    loading: signUpLoading,
    isError: signUpIsError,
  } = useSignup();
  const { login, loading: loginLoading, isError: loginIsError } = useLogin();

  const handleSignup = async (data) => {
    await signUp(data.email, data.name, data.password);
  };

  const handleLogin = async (data) => {
    await login(data.email, data.password);
  };

  const reset_Pass = (data) => {
    setLoading(true);
    axios
      .post("/api/auth/token", data)
      .then(() => {
        showToast(
          toast,
          "Password reset mail Sent!",
          "success",
          "Don't forget to check Spam Folder."
        );
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
          <Link to={"/"}>
            <Text
              fontSize="2xl"
              as={"b"}
              display={"flex"}
              alignItems={"center"}
            >
              <Icon as={BiMoneyWithdraw} />
              Expensify
            </Text>
          </Link>
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
                      {signUpIsError && (
                        <Alert status="error" rounded={5}>
                          <AlertIcon />
                          <AlertTitle>{signUpIsError}</AlertTitle>
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
                        isLoading={signUpLoading}
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
                      {loginIsError && (
                        <Alert status="error" rounded={5}>
                          <AlertIcon />
                          <AlertTitle>{loginIsError}</AlertTitle>
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
                        isLoading={loginLoading}
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
