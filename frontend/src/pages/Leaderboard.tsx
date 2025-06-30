import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Select,
  IconButton,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useAuthContext } from "@/hooks/useAuthContext";
import axios from "axios";
import { useError } from "@/hooks/useError";
import { FaTrophy } from "react-icons/fa";
import { Loading } from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import useTitle from "@/hooks/useTitle";
import CountUp from "react-countup";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";

const Leaderboard = () => {
  const {
    state: { user },
  } = useAuthContext();
  const { verify } = useError();
  useTitle("Expensify - Leaderboard");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "1");
  const [rows, setRows] = useState<number>(
    JSON.parse(localStorage.getItem("leaderboard-rows") ?? "10")
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["leaderboard", { currentPage, rows }],
    queryFn: async () => {
      const res = await axios.get(
        `/api/premium/leaderboard?page=${currentPage}&rows=${rows}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      return res.data as LeaderboardResponse;
    },
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      navigate(`/leaderboard?page=${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      navigate(`/leaderboard?page=${currentPage + 1}`);
    }
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowValue = parseInt(e.target.value, 10);
    setRows(newRowValue);
    localStorage.setItem("leaderboard-rows", JSON.stringify(newRowValue));
    const totalItems = data?.totalItems || 0;
    const newTotalPages = Math.ceil(totalItems / newRowValue);
    const newPage = Math.min(currentPage, newTotalPages);
    navigate(`/leaderboard?page=${newPage}`);
  };

  const isUserInCurrentPage = data?.leaderboard?.some(
    (entry) => entry.email === user?.email
  );

  if (isError) verify(error);

  if (isPending) return <Loading />;

  return (
    <section>
      {data?.leaderboard && data?.leaderboard.length > 0 && (
        <TableContainer
          boxShadow={"md"}
          w={{ base: "90%", md: "75%", lg: "60%" }}
          mx={"auto"}
          my={10}
        >
          <Table variant="simple" size={{ base: "sm", md: "md" }}>
            <Thead>
              <Tr>
                <Th textAlign={"center"}>Rank</Th>
                <Th textAlign={"center"}>Name</Th>
                <Th textAlign={"center"}>Total Expenses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.leaderboard.map((userData, index) => {
                const globalRank = (currentPage - 1) * rows + index + 1;
                return (
                  <Tr
                    key={index}
                    bg={userData.email === user?.email ? "gray.100" : "white"}
                    fontWeight={
                      userData.email === user?.email ? "semibold" : "normal"
                    }
                  >
                    <Td textAlign={"center"}>
                      {globalRank === 1 && <Icon as={FaTrophy} color="gold" />}
                      {globalRank === 2 && (
                        <Icon as={FaTrophy} color="silver" />
                      )}
                      {globalRank === 3 && <Icon as={FaTrophy} color="peru" />}
                      {globalRank > 3 && globalRank}
                    </Td>
                    <Td textAlign={"center"}>{userData.name}</Td>
                    <Td textAlign={"center"}>
                      <CountUp
                        start={0}
                        end={userData.totalExpenses || 0}
                        duration={2}
                        separator=","
                      />
                    </Td>
                  </Tr>
                );
              })}

              {!isUserInCurrentPage && data.currentUser && (
                <Tr bg="gray.50" fontWeight="semibold">
                  <Td textAlign={"center"}>{data.currentUser.rank}</Td>
                  <Td textAlign={"center"}>{data.currentUser.name}</Td>
                  <Td textAlign={"center"}>
                    <CountUp
                      start={0}
                      end={data.currentUser.totalExpenses || 0}
                      duration={2}
                      separator=","
                    />
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          <HStack justifyContent="center" my={3} spacing={4}>
            <IconButton
              icon={<GrCaretPrevious />}
              aria-label="previous-page"
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1}
              size={{ base: "sm", xl: "md" }}
            />
            <IconButton
              icon={<GrCaretNext />}
              aria-label="next-page"
              onClick={handleNextPage}
              isDisabled={currentPage === data?.totalPages}
              size={{ base: "sm", xl: "md" }}
            />
            <Box>
              Page {currentPage} of {data?.totalPages}
            </Box>
            <Select
              size="sm"
              width={"fit-content"}
              value={rows}
              onChange={handleRowChange}
            >
              {[5, 10, 15, 20, 25, 50, 100].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </Select>
          </HStack>
        </TableContainer>
      )}
    </section>
  );
};

export default Leaderboard;
