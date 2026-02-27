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
import { motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useError } from "../hooks/useError";
import useTitle from "../hooks/useTitle";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axiosInstance from "@/lib/axios";


const Dashboard = () => {
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
      const response = await axiosInstance.get(
        `/expense/?page=${currentPage}&rows=${rows}`
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
      return axiosInstance.post("/expense", formData);
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

  const columns: ColumnDef<Expense>[] = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) =>
        moment(getValue() as string).format("DD MMMM YYYY"),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) =>
        Number(getValue()).toLocaleString(),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <HStack justify="center" spacing={2}>
            <IconButton
              aria-label="edit-expense"
              icon={<FiEdit />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => onOpen("EDIT_DIALOG", item)}
            />

            <IconButton
              aria-label="delete-expense"
              icon={<FiTrash2 />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => onOpen("DELETE_DIALOG", item._id)}
              isDisabled={deleteExpense.isPending}
            />
          </HStack>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.expenses ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          boxShadow="md"
          w={{ base: "90%", md: "80%", lg: "70%" }}
          mx="auto"
          maxW="1180px"
          my={5}
        >
          <Table variant="striped" size="sm" colorScheme="blackAlpha" sx={{
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id} textAlign="center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>

            <Tbody>
              {isPending
                ? Array.from({ length: rows }).map((_, i) => (
                  <Tr key={i}>
                    {columns.map((_, idx) => (
                      <Td key={idx}>
                        <Skeleton height="18px" rounded="md" />
                      </Td>
                    ))}
                  </Tr>
                ))
                : table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} textAlign="center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </motion.tr>
                ))}
            </Tbody>
          </Table>

          {/* pagination footer stays EXACTLY the same */}
          <HStack justifyContent="center" my={3} spacing={4}>
            <IconButton
              icon={<GrCaretPrevious />}
              aria-label="previous-page-btn"
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1}
              size={{ base: "sm", xl: "md" }}
            />
            <IconButton
              icon={<GrCaretNext />}
              aria-label="next-page-btn"
              onClick={handleNextPage}
              isDisabled={currentPage === data?.totalPages}
              size={{ base: "sm", xl: "md" }}
            />
            <Box>
              Page {currentPage} of {data?.totalPages}
            </Box>
            <Select
              size="sm"
              width="fit-content"
              value={rows}
              onChange={handleRowChange}
            >
              {[5, 10, 15, 20, 25, 50, 100].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </HStack>
        </TableContainer>
      )}
    </section>
  );
};

export default Dashboard;
