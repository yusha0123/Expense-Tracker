import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { useError } from "../hooks/useError";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import { Loading } from "../components/Loading";

const Leaderboard = () => {
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  const { verify } = useError();
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        isLoading(true);
        const result = await axios.get("/api/premium/leaderboard", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (result.status == 200) {
          setData(result.data);
        }
        isLoading(false);
      } catch (error) {
        isLoading(true);
        verify(error);
      }
    };
    if (user) fetchData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      {data.length > 0 && (
        <TableContainer
          boxShadow={"md"}
          w={{ base: "90%", md: "75%", lg: "60%" }}
          mx={"auto"}
          my={10}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign={"center"}>Rank</Th>
                <Th textAlign={"center"}>Name</Th>
                <Th textAlign={"center"}>Total Expenses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((user, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Td textAlign={"center"}>
                    {index === 0 && <Icon as={FaTrophy} color="gold" />}
                    {index === 1 && <Icon as={FaTrophy} color="silver" />}
                    {index === 2 && <Icon as={FaTrophy} color="peru" />}
                    {index > 2 && index + 1}
                  </Td>
                  <Td textAlign={"center"}>{user.name}</Td>
                  <Td textAlign={"center"}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 1 },
                      }}
                    >
                      <Text>
                        <motion.span
                          initial={{ scale: 0.5 }}
                          animate={{
                            scale: 1,
                            transition: { duration: 1, delay: 0.5 },
                          }}
                        >
                          {user.totalExpenses}
                        </motion.span>
                      </Text>
                    </motion.span>
                  </Td>
                </motion.tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default Leaderboard;
