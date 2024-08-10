import {
  Alert,
  AlertIcon,
  Button,
  Center,
  CircularProgress,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import { FaDownload } from "react-icons/fa";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useError } from "@/hooks/useError";
import useOverlayStore from "@/hooks/useOverlayStore";

const DownloadModal = () => {
  const {
    state: { user },
  } = useAuthContext();
  const { onClose, isOpen, type } = useOverlayStore();

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
          Authorization: `Bearer ${user?.token}`,
        },
      });
      return data as DownloadData[];
    },
    enabled: isOpen && type === "DOWNLOAD_MODAL",
  });

  if (isError) {
    verify(error);
  }

  const downloadFile = (url: string) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    anchor.href = url;
    anchor.download = "Expensify.csv";
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Modal
      isOpen={isOpen && type === "DOWNLOAD_MODAL"}
      onClose={onClose}
      size={modalSize}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>Download History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {(isPending || isError || data?.length === 0) && (
            <Center height={"50vh"}>
              {isPending && (
                <CircularProgress isIndeterminate color="gray.500" />
              )}
              {(isError || data?.length === 0) && (
                <Alert
                  status={isError ? "error" : "info"}
                  rounded={"lg"}
                  width={"fit-content"}
                >
                  <AlertIcon />
                  {isError
                    ? " Something went wrong!"
                    : "No download records found!"}
                </Alert>
              )}
            </Center>
          )}
          {data?.length && data.length > 0 && (
            <TableContainer>
              <Table variant="simple" size={"sm"}>
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
                        {moment(item.createdAt).format("MM/DD/YYYY [at] h:mma")}
                      </Td>
                      <Td textAlign="center">
                        <IconButton
                          icon={<FaDownload />}
                          aria-label="download"
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
