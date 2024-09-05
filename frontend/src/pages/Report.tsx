import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Center,
  Divider,
  HStack,
  Heading,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useRef, useState } from "react";
import { FaDownload, FaHistory } from "react-icons/fa";
import { toast, Id } from "react-toastify";
import { Loading } from "../components/Loading";
import { useAuthContext } from "../hooks/useAuthContext";
import { useError } from "../hooks/useError";
import useTitle from "../hooks/useTitle";
import useOverlayStore from "@/hooks/useOverlayStore";
import Chart from "@/components/Chart";

const Report = () => {
  useTitle("Expensify - Reports");
  const [type, setType] = useState<"monthly" | "yearly" | "weekly">("monthly");
  const {
    state: { user },
  } = useAuthContext();
  const { verify } = useError();
  const toastRef = useRef<Id | null>(null);
  const { onOpen, isOpen } = useOverlayStore();
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user-report", type],
    queryFn: async () => {
      const { data } = await axios.get(`/api/premium/report?type=${type}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return data as ReportData[];
    },
  });

  if (isError) verify(error);

  const downloadReport = useMutation({
    mutationFn: () => {
      toastRef.current = toast.loading("Generating file...");
      return axios.post(
        "/api/premium/report/download",
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          responseType: "blob",
        }
      );
    },
    onSuccess: (response) => {
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Expensify.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      if (toastRef.current !== null) {
        toast.update(toastRef.current, {
          type: "success",
          isLoading: false,
          render: "File generated successfully!",
          autoClose: 3000,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["downloads", isOpen], //prevent caching
      });
    },
    onError: (error) => {
      toast.dismiss();
      verify(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "monthly" | "yearly" | "weekly";
    setType(value);
  };

  if (isPending) {
    return <Loading />;
  }

  const totalAmount = data?.reduce((total, item) => total + item.amount, 0);

  return (
    <section>
      <Box
        rounded={"lg"}
        bg={"white"}
        boxShadow={"md"}
        p={3}
        my={5}
        mx={"auto"}
        w={["95%", "70%", "60%", "40%", "35%"]}
        maxWidth={"500px"}
      >
        <Heading
          textAlign={"center"}
          as={"h3"}
          mb={3}
          size={{
            base: "lg",
            md: "lg",
          }}
        >
          Financial Snapshot
        </Heading>
        <Divider />
        <HStack justifyContent={"space-evenly"} my={4}>
          <Select
            width={"40%"}
            value={type}
            size={{
              base: "sm",
              md: "md",
            }}
            onChange={handleChange}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
          <IconButton
            aria-label="download-btn"
            icon={<FaDownload />}
            onClick={() => downloadReport.mutate()}
            colorScheme="messenger"
            size={{
              base: "sm",
              md: "md",
            }}
            isDisabled={data?.length === 0 || downloadReport.isPending}
          />
          <IconButton
            icon={<FaHistory />}
            aria-label="history-btn"
            onClick={() => onOpen("DOWNLOAD_MODAL")}
            colorScheme="purple"
            size={{
              base: "sm",
              md: "md",
            }}
          />
        </HStack>
        <Divider />
        <Center>
          <Badge
            colorScheme="red"
            fontSize={{ base: "0.7em", md: "0.9em" }}
            my={2}
            p={1.5}
            textTransform={"none"}
            rounded={"md"}
          >
            {type === "monthly"
              ? `Total Expenses in ${moment(new Date()).format("MMMM")} : `
              : `Total Expenses in the year ${moment(new Date()).format(
                  "YYYY"
                )} : `}
            &#x20B9;{totalAmount}
          </Badge>
        </Center>
      </Box>
      {data?.length !== undefined && data.length > 0 && (
        <Box maxW={"1024px"} marginY={"0.7rem"} marginX={"auto"}>
          <Chart data={data} type={type} />
        </Box>
      )}
      {data?.length === 0 && (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          maxW={"600px"}
          mx={"auto"}
          w={["95%", "85%", "70%", "60%"]}
          rounded={"lg"}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No Data Found!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Please add an expense from the Dashboard to see it here.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
};

export default Report;
