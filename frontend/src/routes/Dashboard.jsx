import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  Tooltip,
  ScaleFade,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useError } from "../hooks/useError";
import { AiFillDelete } from "react-icons/ai";
import { IconButton } from "@chakra-ui/react";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import { useAuthContext } from "../hooks/useAuthContext";

const Dashboard = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataId, setDataId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("rows")) || 10
  );
  const cancelRef = useRef();
  const { verify } = useError();
  const { register, handleSubmit, reset } = useForm();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user-expenses", { currentPage, rows }],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/expense/?page=${currentPage}&rows=${rows}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      return data;
    },
  });
  if (isError) {
    verify(error);
  }

  const createExpense = useMutation({
    mutationFn: (expense) => {
      return axios.post("/api/expense", expense, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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

  const deleteExpense = useMutation({
    mutationFn: () => {
      setAlertOpen(false);
      return axios.delete(`/api/expense/${dataId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-expenses", { currentPage, rows }],
      });
    },
    onError: (error) => {
      verify(error);
    },
  });

  const handleClick = (id) => {
    setDataId(id);
    setAlertOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowChange = (e) => {
    setRows(e.target.value);
    localStorage.setItem("rows", JSON.stringify(e.target.value));
  };

  return (
    <>
      <ScaleFade initialScale={0.9} in={true}>
        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"md"}
          p={6}
          my={5}
          mx={"auto"}
          w={["95%", "85%", "60%", "40%"]}
          maxWidth={"767px"}
        >
          <Heading fontSize="2xl" mb={3} textAlign={"center"}>
            Add your Expense
          </Heading>
          <form onSubmit={handleSubmit(createExpense.mutate)}>
            <VStack spacing={3}>
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
                <option value="Bills & EMI's">Bills & EMI's</option>
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
        <Center mt={20}>
          <Spinner size="lg" />
        </Center>
      )}
      {data?.expenses?.length > 0 && (
        <TableContainer
          boxShadow={"md"}
          w={{ base: "90%", md: "75%", lg: "60%" }}
          mx={"auto"}
          my={10}
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
                  <Td textAlign={"center"}>{item.amount}</Td>
                  <Td textAlign={"center"}>{item.category}</Td>
                  <Td textAlign={"center"}>{item.description}</Td>
                  <Td textAlign={"center"}>
                    <Tooltip label="Delete Expense" hasArrow>
                      <IconButton
                        icon={<AiFillDelete />}
                        colorScheme="red"
                        onClick={() => handleClick(item._id)}
                        isDisabled={deleteExpense.isPending}
                      />
                    </Tooltip>
                  </Td>
                </motion.tr>
              ))}
            </Tbody>
          </Table>
          <HStack justifyContent={"center"} my={3} spacing={4}>
            <Tooltip label="Previous">
              <IconButton
                icon={<GrCaretPrevious />}
                onClick={handlePreviousPage}
                isDisabled={currentPage === 1}
              />
            </Tooltip>
            <Tooltip label="Next">
              <IconButton
                icon={<GrCaretNext />}
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
              />
            </Tooltip>
            <Box>
              Page {currentPage} of {totalPages}
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
      <AlertDialog
        isOpen={alertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Expense
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteExpense.mutate} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Dashboard;
