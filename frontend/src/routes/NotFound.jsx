import { Box, Grid, Heading, Image, Icon, Text } from "@chakra-ui/react";
import React from "react";
import Image_404 from "../assets/NotFound.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BiMoneyWithdraw } from "react-icons/bi";

const NotFound = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Box
        position={"fixed"}
        top={3}
        left={0}
        right={0}
        display="flex"
        justifyContent="center"
      >
        <Link to={"/"}>
          <Text fontSize="2xl" as={"b"} display={"flex"} alignItems={"center"}>
            <Icon as={BiMoneyWithdraw} />
            Expensify
          </Text>
        </Link>
      </Box>
      <Box
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
            <Heading textAlign="center" color={"gray.600"}>
              Page not Found!
            </Heading>
          </motion.div>
          <motion.div
            transition={{ duration: 1 }}
            initial={{
              x: "100vw",
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Image src={Image_404} alt="404 image" objectFit="cover" />
          </motion.div>
        </Grid>
      </Box>
    </div>
  );
};

export default NotFound;
