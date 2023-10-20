import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { BsPersonCircle } from "react-icons/bs";
import { BiMoneyWithdraw } from "react-icons/bi";
import { AiOutlineClose, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiCrownBold } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUpgrade } from "../hooks/useUpgrade";
import axios from "axios";
import showToast from "../hooks/showToast";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { upgrade } = useUpgrade();
  const { dispatch } = useAuthContext();
  const toast = useToast();

  const handleNavclick = async (link) => {
    onClose();
    if (link == "Buy Premium" && !user.isPremium) {
      try {
        const result = await axios.get("/api/premium/create", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        handleOpenRazorPay(result.data.data);
      } catch (error) {
        console.log(error);
        showToast(toast, "Something went Wrong!", "error");
      }
    } else if (!user.isPremium) {
      showToast(
        toast,
        "Feature Unavailable!",
        "warning",
        "Please Upgrade your account."
      );
    } else {
      const Link = link.toLowerCase();
      navigate(`/${Link}`);
    }
  };

  const handleOpenRazorPay = (data) => {
    const options = {
      key: import.meta.env.RAZOR_PAY_KEY,
      name: "Expensify",
      order_id: data.id,
      handler: async function (response) {
        try {
          const result = await axios.post("/api/premium/verify", response, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          if (result.data.success) {
            showToast(
              toast,
              "Congratulations!",
              "success",
              "You are now a Premium Member"
            );
          }
          dispatch({ type: "TOGGLE_CONFETTI" });
          upgrade();
        } catch (error) {
          console.log(error);
          showToast(toast, "Something went Wrong!", "error");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const NavLink = (props) => {
    const { children, showLock, showCrown } = props;

    return (
      <Box
        px={2}
        py={1}
        rounded={"md"}
        fontWeight={500}
        cursor={"pointer"}
        _hover={{
          textDecoration: "none",
          bg: "gray.200",
        }}
        onClick={() => handleNavclick(children)}
        display={"flex"}
        alignItems={"center"}
      >
        {children}
        {showLock && <Icon as={AiOutlineLock} />}
        {showCrown && <Icon as={PiCrownBold} ml={1} />}
      </Box>
    );
  };

  return (
    <>
      <Box bg={"gray.100"} px={4} boxShadow={"sm"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            px={4}
            onClick={isOpen ? onClose : onOpen}
          />
          <Text
            fontSize="2xl"
            as={"b"}
            display={"flex"}
            alignItems={"center"}
            onClick={() => navigate("/dashboard")}
            cursor={"pointer"}
          >
            <Icon as={BiMoneyWithdraw} />
            Expensify
          </Text>
          <HStack alignItems={"center"} spacing={8}>
            <HStack
              alignItems={"center"}
              spacing={8}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink showLock={user.isPremium == false}>Reports</NavLink>
              <NavLink showLock={user.isPremium == false}>Leaderboard</NavLink>
              {!user.isPremium && (
                <NavLink showCrown={true}>Buy Premium</NavLink>
              )}
            </HStack>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                color={"gray.600"}
              >
                <BsPersonCircle />
              </MenuButton>
              <MenuList>
                <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                  <Icon as={AiOutlineMail} />
                  {user.email}
                </MenuItem>
                <MenuDivider />
                {user.isPremium && (
                  <>
                    <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                      <Icon as={PiCrownBold} />
                      Premium User
                    </MenuItem>
                    <MenuDivider />
                  </>
                )}
                <MenuItem
                  onClick={logout}
                  display={"flex"}
                  alignItems={"center"}
                  gap={3}
                >
                  <Icon as={HiOutlineLogout} />
                  logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        {isOpen ? (
          <motion.div
            style={{ paddingBottom: "20px" }}
            display={{ md: "none" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Stack as={"nav"} spacing={4}>
              <NavLink showLock={user.isPremium == false}>Reports</NavLink>
              <NavLink showLock={user.isPremium == false}>Leaderboard</NavLink>
              {!user.isPremium && (
                <NavLink showCrown={true}>Buy Premium</NavLink>
              )}
            </Stack>
          </motion.div>
        ) : null}
      </Box>
    </>
  );
}
