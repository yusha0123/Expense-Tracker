const showToast = (toast, title, status, description = "") => {
  toast({
    title: title,
    status: status,
    description: description,
    duration: 5000,
    isClosable: true,
    position: "top",
  });
};

export default showToast;
