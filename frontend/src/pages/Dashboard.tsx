import useDeleteExpense from "@/hooks/useDeleteExpense";
import useOverlayStore from "@/hooks/useOverlayStore";
import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  IconButton,
  Input,
  ScaleFade,
  Select,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useError } from "../hooks/useError";
import useTitle from "../hooks/useTitle";

const Dashboard = () => {
  const {
    state: { user },
  } = useAuthContext();
  useTitle("Expensify - Dashboard");
  const queryClient = useQueryClient();
  const { onOpen } = useOverlayStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "1");
  const [rows, setRows] = useState<number>(
    JSON.parse(localStorage.getItem("rows") ?? "10")
  );
  const { verify } = useError();
  const { register, handleSubmit, reset } = useForm();
  const deleteExpense = useDeleteExpense();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user-expenses", { currentPage, rows }],
    queryFn: async () => {
      const response = await axios.get(
        `/api/expense/?page=${currentPage}&rows=${rows}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = response.data as DashboardData;
      navigate(`/dashboard?page=${data.currentPage}`);
      return data;
    },
  });

  if (isError) {
    verify(error);
  }

  const createExpense = useMutation({
    mutationFn: (formData: Record<string, unknown>) => {
      return axios.post("/api/expense", formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-expenses", { currentPage, rows }],
      });
      reset();
    },
    onError: (error) => {
      verify(error);
    },
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      navigate(`/dashboard?page=${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      navigate(`/dashboard?page=${currentPage + 1}`);
    }
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowValue = parseInt(e.target.value, 10);
    setRows(newRowValue);
    localStorage.setItem("rows", JSON.stringify(newRowValue));

    const totalItems = data?.totalItems || 0;
    const newTotalPages = Math.ceil(totalItems / newRowValue);

    let newPage = Math.min(currentPage, newTotalPages);
    if (currentPage > newTotalPages) {
      newPage = newTotalPages;
    }
    navigate(`/dashboard?page=${newPage}`);
  };

  const onSubmit = (data: Record<string, unknown>) => {
    createExpense.mutate(data);
  };

  return (
    <section className="pb-5">
      <ScaleFade initialScale={0.9} in={true}>
        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"base"}
          p={6}
          my={5}
          mx={"auto"}
          w={["95%", "85%", "60%", "50%"]}
          maxWidth={{
            sm: "400px",
            md: "520px",
          }}
        >
          <Heading fontSize="2xl" mb={5} textAlign={"center"}>
            Add your Expense
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={3}
              marginBottom={3}
            >
              <Input
                autoComplete="off"
                isRequired
                type="number"
                {...register("amount")}
                size={{
                  base: "sm",
                  md: "md",
                }}
                placeholder="Amount &#x20B9;"
              />
              <Select
                placeholder="Select Category"
                isRequired
                {...register("category")}
                size={{
                  base: "sm",
                  md: "md",
                }}
              >
                <option value="Mobile & Computers">Mobile & Computers</option>
                <option value="Books & Education">Books & Education</option>
                <option value="Sports, Outdoor & Travel">
                  Sports, Outdoor & Travel
                </option>
                <option value="Bills & EMI's">Bills & EMI&apos;s</option>
                <option value="Groceries & Pet Supplies">
                  Groceries & Pet Supplies
                </option>
                <option value="Fashion & Beauty">Fashion & Beauty</option>
                <option value="Gifts & Donations">Gifts & Donations</option>
                <option value="Investments">Investments</option>
                <option value="Insurance">Insurance</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Home & Utilities">Home & Utilities</option>
                <option value="Hobbies & Leisure">Hobbies & Leisure</option>
              </Select>
            </Grid>
            <VStack spacing={3}>
              <Input
                autoComplete="off"
                isRequired
                placeholder={"Description"}
                {...register("description")}
                size={{
                  base: "sm",
                  md: "md",
                }}
              />
              <Button
                colorScheme="teal"
                minWidth={"150px"}
                width={"40%"}
                size={{
                  base: "sm",
                  md: "md",
                }}
                type="submit"
                isLoading={createExpense.isPending}
              >
                Add Expense
              </Button>
            </VStack>
          </form>
        </Box>
      </ScaleFade>
      {isPending && (
        <Stack>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              height="55px"
              rounded={"7px"}
              w={{ base: "90%", md: "80%", lg: "70%" }}
              mx="auto"
              maxW="1180px"
            />
          ))}
        </Stack>
      )}
      {(data?.expenses?.length ?? 0) > 0 && (
        <TableContainer
          boxShadow={"md"}
          w={{ base: "90%", md: "80%", lg: "70%" }}
          mx={"auto"}
          maxW={"1180px"}
          my={5}
        >
          <Table variant="striped" size={"sm"} colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th textAlign={"center"}>#</Th>
                <Th textAlign={"center"}>Date</Th>
                <Th textAlign={"center"}>Amount</Th>
                <Th textAlign={"center"}>Category</Th>
                <Th textAlign={"center"}>Description</Th>
                <Th textAlign={"center"}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.expenses?.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Td textAlign={"center"}>{index + 1}</Td>
                  <Td textAlign={"center"}>
                    {moment(item.createdAt).format("DD MMMM YYYY")}
                  </Td>
                  <Td textAlign={"center"}>{item.amount.toLocaleString()}</Td>
                  <Td textAlign={"center"}>{item.category}</Td>
                  <Td textAlign={"center"}>{item.description}</Td>
                  <Td textAlign={"center"}>
                    <IconButton
                      icon={<AiFillDelete />}
                      aria-label="delete-btn"
                      colorScheme="red"
                      onClick={() => onOpen("DELETE_DIALOG", item._id)}
                      isDisabled={deleteExpense.isPending}
                    />
                  </Td>
                </motion.tr>
              ))}
            </Tbody>
          </Table>
          <HStack justifyContent={"center"} my={3} spacing={4}>
            <IconButton
              icon={<GrCaretPrevious />}
              aria-label="previous-page-btn"
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1}
              size={{
                base: "sm",
                xl: "md",
              }}
            />
            <IconButton
              icon={<GrCaretNext />}
              size={{
                base: "sm",
                xl: "md",
              }}
              aria-label="next-page-btn"
              onClick={handleNextPage}
              isDisabled={currentPage === data?.totalPages}
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
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
          </HStack>
        </TableContainer>
      )}
    </section>
  );
};

export default Dashboard;
