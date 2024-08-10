import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuthContext } from "@/hooks/useAuthContext";
import useTitle from "@/hooks/useTitle";

const NotFound = () => {
  const {
    state: { user },
  } = useAuthContext();
  const navigate = useNavigate();
  useTitle("Expensify - Page not found");

  return (
    <>
      <Box
        position={"fixed"}
        top={3}
        left={0}
        right={0}
        display="flex"
        justifyContent="center"
      >
        <Logo />
      </Box>
      <Flex
        minH={"100vh"}
        flexDirection={"column"}
        align={"center"}
        justify={"center"}
        bg="gray.100"
        gap={4}
      >
        <Heading as="h1" size="4xl">
          404
        </Heading>
        <Text as={"h2"} fontSize="2xl" mb={5}>
          Error Occured! Page could not be found
        </Text>
        <Button
          colorScheme="teal"
          onClick={() => navigate(user ? "/dashboard" : "/")}
        >
          Back to Homepage
        </Button>
      </Flex>
    </>
  );
};

export default NotFound;
