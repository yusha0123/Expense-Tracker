import { Box, CircularProgress } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex="99"
    >
      <CircularProgress isIndeterminate />
    </Box>
  );
};
