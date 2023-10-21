import { useRef } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Show,
  Icon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineClose, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiCrownBold } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useUpgrade } from "../hooks/useUpgrade";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "./Logo";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { upgrade } = useUpgrade();
  const drawerBtnRef = useRef();

  const handleNavclick = async (link) => {
    onClose();
    if (link == "Buy Premium" && !user.isPremium) {
      try {
        const result = await axios.get("/api/premium/create-order", {
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
      toast.warning("Please Upgrade to Pro!");
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
          const result = await axios.post(
            "/api/premium/verify-order",
            response,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (result.data.success) {
            // showToast(
            //   toast,
            //   "Congratulations!",
            //   "success",
            //   "You are now a Premium Member"
            // );
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

  const NavLink = ({ children, showLock, showCrown }) => (
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

  return (
    <>
      <Box bg={"gray.100"} px={4} boxShadow={"sm"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Logo />
          <Show breakpoint="(min-width: 767px)">
            <HStack alignItems={"center"} spacing={8}>
              <HStack alignItems={"center"} spacing={8}>
                <NavLink showLock={user.isPremium == false}>Reports</NavLink>
                <NavLink showLock={user.isPremium == false}>
                  Leaderboard
                </NavLink>
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
                  {user.isPremium ? (
                    <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                      <Icon as={PiCrownBold} />
                      Premium User
                    </MenuItem>
                  ) : (
                    <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                      <Icon as={FaUser} />
                      Regular User
                    </MenuItem>
                  )}
                  <MenuDivider />
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
          </Show>
          <Show breakpoint="(max-width: 767px)">
            <IconButton
              size={"md"}
              icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
              aria-label={"Open Menu"}
              ref={drawerBtnRef}
              onClick={isOpen ? onClose : onOpen}
            />
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={drawerBtnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader textAlign={"center"} borderBottomWidth={"1px"}>
                  Menu
                </DrawerHeader>
                <DrawerBody>
                  <VStack spacing={5}>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      {user.email}
                      <Icon as={AiOutlineMail} />
                    </Box>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                      {user.isPremium ? (
                        <>
                          Premium User
                          <Icon as={PiCrownBold} />
                        </>
                      ) : (
                        <>
                          Regular User
                          <Icon as={FaUser} />
                        </>
                      )}
                    </Box>
                    <Divider />
                    <NavLink showLock={user.isPremium == false}>
                      Reports
                    </NavLink>
                    <NavLink showLock={user.isPremium == false}>
                      Leaderboard
                    </NavLink>
                    {!user.isPremium && (
                      <NavLink showCrown={true}>Buy Premium</NavLink>
                    )}
                    <Divider />
                  </VStack>
                </DrawerBody>
                <DrawerFooter>
                  <Button
                    colorScheme="red"
                    onClick={logout}
                    mx={"auto"}
                    rightIcon={<Icon as={HiOutlineLogout} />}
                  >
                    Logout
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Show>
        </Flex>
      </Box>
    </>
  );
}
