import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Button,
  Center,
  CircularProgress,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { FaDownload } from "react-icons/fa";
import { useError } from "../hooks/useError";

const DownloadModal = ({ isOpen, onClose, user }) => {
  const modalSize = useBreakpointValue({
    base: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
  });
  const { verify } = useError();

  const { data, isPending, error, isError } = useQuery({
    queryKey: ["downloads", isOpen],
    queryFn: async () => {
      const { data } = await axios.get("/api/premium/report/download-history", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return data;
    },
    enabled: isOpen,
  });

  if (isError) {
    verify(error);
  }

  const downloadFile = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const newBlob = new Blob([blob]);
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(newBlob);
        anchor.download = "Expensify.csv";
        anchor.click();
      } else {
        toast.error("Failed to download file!");
      }
    };
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>Download History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {(isPending || isError) && (
            <Center height={"50vh"}>
              {isPending && (
                <CircularProgress isIndeterminate color="gray.500" />
              )}
              {isError && (
                <Alert status="error" rounded={"lg"} width={"fit-content"}>
                  <AlertIcon />
                  Something went wrong!
                </Alert>
              )}
            </Center>
          )}
          {data?.length > 0 && (
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
                  {data?.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Td textAlign={"center"}>{index + 1}</Td>
                      <Td textAlign="center">
                        {moment(item.createdAt).format(
                          "MMMM DD, YYYY hh:mm:ss A"
                        )}
                      </Td>
                      <Td textAlign="center">
                        <IconButton
                          icon={<FaDownload />}
                          colorScheme="whatsapp"
                          onClick={() => downloadFile(item.url)}
                        />
                      </Td>
                    </motion.tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mx={"auto"} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DownloadModal;