import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Select,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
} from "@chakra-ui/react";
import { AiFillFile } from "react-icons/ai";
import { BiShowAlt } from "react-icons/bi";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useError } from "../hooks/useError";
import ReportData from "../components/ReportData";
import { useForm } from "react-hook-form";
import showToast from "../hooks/showToast";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

const Report = () => {
  const [type, setType] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuthContext();
  const { verify } = useError();
  const { register, handleSubmit } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const modalSize = useBreakpointValue({ base: "xs", md: "md", xl: "xl" });
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Use 12-hour format with AM/PM
  };

  const fetchReport = async (data) => {
    setLoading(true);
    try {
      const result = await axios.get(`/api/premium/report?type=${data.type}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (result.status == 200) {
        console.log(result);
        setData(result.data);
        setType(data.type);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      verify(error);
    }
  };

  const downloadReport = async () => {
    try {
      const result = await axios.get("/api/premium/report/download", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (result.status == 200) {
        if (!result.data.success) {
          showToast(toast, "No expenses to Download!", "warning");
        } else {
          downloadFile(result.data.url);
        }
      }
    } catch (error) {
      verify(error);
    }
  };

  const fetchDownloads = async () => {
    try {
      const result = await axios.get("/api/premium/user/downloads", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (result.status == 200) {
        if (result.data.length == 0) {
          showToast(
            toast,
            "No Records!",
            "warning",
            "Previous downloads not Found."
          );
        } else {
          setDownloads(result.data);
          setOpenModal(true);
        }
      }
    } catch (error) {
      verify(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const downloadFile = (link) => {
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.setAttribute("download", "Expensify.csv");
    anchor.click();
  };

  return (
    <>
      <Box
        rounded={"lg"}
        bg={"white"}
        boxShadow={"md"}
        p={6}
        my={5}
        mx={"auto"}
        w={{ base: "90%", md: "60%", lg: "40%" }}
        maxWidth={"1024px"}
      >
        <Heading textAlign={"center"} as={"h3"} mb={3}>
          Financial Snapshot
        </Heading>
        <Divider />
        <VStack spacing={2} my={4}>
          <form onSubmit={handleSubmit(fetchReport)}>
            <Box
              display={{ base: "flex", md: "row" }}
              flexDirection={{ base: "column", md: "row" }}
              gap={3}
            >
              <Select
                placeholder="Select report type"
                width={"fit-content"}
                {...register("type")}
                isRequired
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
              <Button colorScheme="green" type="submit" isDisabled={loading}>
                Get Report
              </Button>
            </Box>
          </form>
          <Divider />
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "center", md: "flex-start" }}
            justify={{ base: "center", md: "flex-start" }}
            gap="4"
          >
            <Button
              colorScheme="gray"
              rightIcon={<AiFillFile />}
              onClick={downloadReport}
            >
              Download File
            </Button>
            <Button
              colorScheme="gray"
              rightIcon={<BiShowAlt />}
              onClick={fetchDownloads}
            >
              Show Downloads
            </Button>
          </Flex>
        </VStack>
      </Box>
      {data.length > 0 && <ReportData data={data} type={type} />}
      <Modal isOpen={openModal} onClose={closeModal} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Download History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th textAlign={"center"}>#</Th>
                    <Th textAlign={"center"}>Date</Th>
                    <Th textAlign={"center"}>Download </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {downloads?.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Td textAlign={"center"}>{index + 1}</Td>
                      <Td textAlign="center">
                        {new Date(item.createdAt).toLocaleDateString(
                          "en-US",
                          options
                        )}
                      </Td>
                      <Td textAlign="center">
                        <IconButton
                          icon={<FaDownload />}
                          bg={"green.100"}
                          _hover={{ bg: "green.200" }}
                          onClick={() => downloadFile(item.url)}
                        />
                      </Td>
                    </motion.tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mx={"auto"} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Report;
