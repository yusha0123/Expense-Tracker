import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
} from "@chakra-ui/react";
import { useAuthContext } from "@/hooks/useAuthContext";
import axios from "axios";
import { useError } from "@/hooks/useError";
import { FaTrophy } from "react-icons/fa";
import { Loading } from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import useTitle from "@/hooks/useTitle";
import CountUp from "react-countup";

const Leaderboard = () => {
  const {
    state: { user },
  } = useAuthContext();
  const { verify } = useError();
  useTitle("Expensify - Leaderboard");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await axios.get("/api/premium/leaderboard", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return data as LeaderboardData[];
    },
  });

  if (isError) verify(error);

  if (isPending) {
    return <Loading />;
  }

  return (
    <section>
      {data?.length !== undefined && data.length > 0 && (
        <TableContainer
          boxShadow={"md"}
          w={{ base: "90%", md: "75%", lg: "60%" }}
          mx={"auto"}
          my={10}
        >
          <Table
            variant="simple"
            size={{
              base: "sm",
              md: "md",
            }}
          >
            <Thead>
              <Tr>
                <Th textAlign={"center"}>Rank</Th>
                <Th textAlign={"center"}>Name</Th>
                <Th textAlign={"center"}>Total Expenses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((userData, index) => (
                <Tr
                  key={index}
                  bg={userData.email === user?.email ? "gray.100" : "white"}
                >
                  <Td textAlign={"center"}>
                    {index === 0 && <Icon as={FaTrophy} color="gold" />}
                    {index === 1 && <Icon as={FaTrophy} color="silver" />}
                    {index === 2 && <Icon as={FaTrophy} color="peru" />}
                    {index > 2 && index + 1}
                  </Td>
                  <Td textAlign={"center"}>{userData.name}</Td>
                  <Td textAlign={"center"}>
                    <CountUp
                      start={0}
                      end={userData?.totalExpenses || 0}
                      duration={2}
                      separator=","
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </section>
  );
};

export default Leaderboard;
