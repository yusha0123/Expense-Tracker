import Chart from "@/components/Chart";
import { useDownloadReport } from "@/hooks/useDownloadReport";
import useOverlayStore from "@/hooks/useOverlayStore";
import axiosInstance from "@/lib/axios";
import { ReportData, ReportType } from "@/types/report";
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
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { FaDownload, FaHistory } from "react-icons/fa";
import { Loading } from "../components/Loading";
import { useTitle } from 'react-use';

const Report = () => {
  useTitle("Expensify - Reports");
  const [type, setType] = useState<ReportType>("monthly");
  const { onOpen } = useOverlayStore();
  const downloadReport = useDownloadReport();

  const { isPending, data } = useQuery({
    queryKey: ["user-report", type],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/premium/report?type=${type}`);
      return data as ReportData[];
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ReportType;
    setType(value);
  };

  const totalAmount = data?.reduce((total, item) => total + item.amount, 0);

  if (isPending) {
    return <Loading />;
  }

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
            onClick={() => downloadReport.mutate({ data: data ?? [] })}
            colorScheme="blue"
            size={{
              base: "sm",
              md: "md",
            }}
            isDisabled={!data?.length || downloadReport.isPending}
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
