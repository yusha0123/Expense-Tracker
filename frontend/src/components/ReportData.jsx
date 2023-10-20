import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const ReportData = ({ type, data }) => {
  const totalAmount = data.reduce((total, item) => total + item.amount, 0);
  return (
    <TableContainer
      boxShadow={"md"}
      w={{ base: "90%", md: "80%", lg: "65%" }}
      mx={"auto"}
      my={10}
    >
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th textAlign={"center"}>#</Th>
            <Th textAlign={"center"}>{type == "monthly" ? "Date" : "Month"}</Th>
            <Th textAlign={"center"}>Category</Th>
            <Th textAlign={"center"}>Description</Th>
            <Th textAlign={"center"}>Category</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Td textAlign={"center"}>{index + 1}</Td>
              <Td textAlign="center">
                {type === "monthly"
                  ? new Date(item.createdAt).toLocaleDateString("en-GB")
                  : new Date(item.createdAt).toLocaleDateString("en-GB", {
                      month: "long",
                    })}
              </Td>
              <Td textAlign="center">{item.category}</Td>
              <Td textAlign="center">{item.description}</Td>
              <Td textAlign="center">{item.amount}</Td>
            </motion.tr>
          ))}
        </Tbody>
      </Table>
      <Text textAlign={"center"} py={3}>
        Total Amount: <b>{totalAmount}</b>
      </Text>
    </TableContainer>
  );
};

export default ReportData;
