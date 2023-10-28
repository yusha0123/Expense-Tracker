import React from "react";
import {
  Box,
  Grid,
  Image,
  Heading,
  Button,
  Text,
  GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import HeroImage from "../assets/Hero-image.webp";

const Root = () => {
  const navigate = useNavigate();

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section
      style={{
        overflowX: "hidden",
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <Box
        as="nav"
        boxShadow="sm"
        zIndex={10}
        position={"absolute"}
        top={0}
        right={0}
        left={0}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={{
            base: "4",
            md: "5",
            lg: 6,
          }}
          py={{
            base: "2.5",
            lg: "3",
            xl: "4",
          }}
        >
          <Logo />
          <Button
            colorScheme="linkedin"
            onClick={() => navigate("/auth")}
            size={{ base: "sm", md: "md" }}
          >
            Sign In / Login
          </Button>
        </Box>
      </Box>
      <Box
        mx="auto"
        width={{
          base: "95%",
          md: "90%",
          lg: "85%",
        }}
        maxW={"1024px"}
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={{
            base: 0.5,
            md: 4,
            lg: 6,
          }}
          justifyContent="center"
          alignItems="center"
        >
          <GridItem>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Heading
                textAlign={{
                  base: "center",
                  lg: "left",
                }}
                fontSize={{
                  base: "2xl",
                  md: "3xl",
                  lg: "4xl",
                }}
                mb={{
                  base: 2,
                  md: 4,
                  lg: 6,
                }}
              >
                Welcome to Expensify!
              </Heading>
              <Text
                textAlign={{
                  base: "center",
                  lg: "left",
                }}
                fontSize={{
                  base: "lg",
                  md: "xl",
                  lg: "2xl",
                }}
              >
                Keep track of your expenses easily and manage your finances
                effectively with our user-friendly expense tracker.
              </Text>
            </motion.div>
          </GridItem>
          <GridItem>
            <motion.img
              src={HeroImage}
              className="hero-image"
              alt="Hero image"
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.4 }}
            />
          </GridItem>
        </Grid>
      </Box>
    </section>
  );
};

export default Root;
