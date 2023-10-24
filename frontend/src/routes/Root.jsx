import React from "react";
import {
  Box,
  Grid,
  Image,
  Heading,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import HeroImage from "../assets/Landing_image.png";

const Root = () => {
  const navigate = useNavigate();

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

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
          <Logo />
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
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.2 }}
          >
            <VStack gap={5}>
              <Heading
                textAlign="center"
                fontSize={{
                  base: "2xl",
                  md: "3xl",
                  lg: "4xl",
                }}
              >
                Welcome to Expensify!
              </Heading>
              <Text
                textAlign="center"
                fontSize={{
                  base: "xl",
                  md: "2xl",
                  lg: "3xl",
                }}
              >
                Track your expenses and save money with Ease.
              </Text>
            </VStack>
          </motion.div>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Image src={HeroImage} alt="Hero image" objectFit="cover" />
          </motion.div>
        </Grid>
      </Box>
    </section>
  );
};

export default Root;
