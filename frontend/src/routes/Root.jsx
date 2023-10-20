import React from "react";
import {
  Box,
  Grid,
  Image,
  Heading,
  Button,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import HeroImage from "../assets/Landing_image.png";
import { BiMoneyWithdraw } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Root = () => {
  const navigate = useNavigate();
  return (
    <section style={{ overflowX: "hidden" }}>
      <Box as="nav" boxShadow="md">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={{
            base: "3",
            lg: "6",
          }}
          py={{
            base: "3",
            lg: "4",
          }}
        >
          <Box>
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
          <Button colorScheme="linkedin" onClick={() => navigate("/auth")}>
            Sign In / Login
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ marginTop: 5 }}
        display="flex"
        alignItems="center"
        width="90%"
        height="100%"
        mx="auto"
        justifyContent="center"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={6}
          justifyContent="center"
          alignItems="center"
        >
          <motion.div
            transition={{ duration: 1 }}
            initial={{
              x: "-100vw",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
          >
            <VStack gap={5}>
              <Heading textAlign="center" color={"gray.600"}>
                Welcome to Expensify!
              </Heading>
              <Text textAlign="center" color={"gray.600"} fontSize="3xl">
                Track your expenses and save money with Ease.
              </Text>
            </VStack>
          </motion.div>
          <motion.div
            transition={{ duration: 1 }}
            initial={{
              x: "100vw",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Image src={HeroImage} alt="Hero image" objectFit="cover" />
          </motion.div>
        </Grid>
      </Box>
    </section>
  );
};

export default Root;
