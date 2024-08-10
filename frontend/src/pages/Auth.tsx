import {
  Box,
  Flex,
  ScaleFade,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import Logo from "@/components/Logo";
import Signup from "@/components/Signup";
import useTitle from "@/hooks/useTitle";
import Login from "@/components/Login";

const Auth = () => {
  useTitle("Expensify - Login/Signup");

  const [searchParams] = useSearchParams();
  const activateLoginPanel = searchParams.get("action") === "login";

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
          xl: "576px",
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
          <Tabs
            isFitted
            variant="enclosed-colored"
            colorScheme="green"
            defaultIndex={activateLoginPanel ? 1 : 0}
          >
            <TabList mb={"1em"}>
              <Tab>Sign Up</Tab>
              <Tab>Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Signup />
              </TabPanel>
              <TabPanel>
                <Login />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ScaleFade>
      </Box>
    </Flex>
  );
};

export default Auth;
