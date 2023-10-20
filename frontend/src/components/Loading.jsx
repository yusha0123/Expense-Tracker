import { Box, Spinner } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex="99"
    >
      <Spinner
        size="xl"
        thickness="4px"
        speed="0.60s"
        emptyColor="gray.200"
        color="gray.500"
      />
    </Box>
  );
};
