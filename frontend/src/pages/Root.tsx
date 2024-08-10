import { Box, Button, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeroImage from "../assets/Hero-image.webp";
import Logo from "../components/Logo";

const Root = () => {
  const navigate = useNavigate();

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="overflow-x-hidden relative h-[100dvh] w-full">
      <header className="absolute top-0 inset-x-0 z-10 shadow-sm">
        <div className="flex justify-between items-center p-3 md:px-5 xl:px-8 md:py-4 max-w-screen-xl">
          <Logo />
          <Button
            colorScheme="linkedin"
            onClick={() => navigate("/auth")}
            size={{ base: "sm", md: "md" }}
          >
            Sign In / Login
          </Button>
        </div>
      </header>
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
