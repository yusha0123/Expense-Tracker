import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Show,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineLogout } from "react-icons/hi";
import { PiCrownBold } from "react-icons/pi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Navlink from "./Navlink";
import Logo from "./Logo";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const drawerBtnRef = useRef();

  return (
    <nav className="px-4 bg-gray-100 shadow fixed top-0 inset-x-0 z-10">
      <Flex
        h={{
          base: 12,
          md: 16,
        }}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Logo />
        <Show breakpoint="(min-width: 767px)">
          <HStack alignItems={"center"} spacing={8}>
            <HStack alignItems={"center"} spacing={8}>
              <Navlink showLock={user.isPremium == false}>Reports</Navlink>
              <Navlink showLock={user.isPremium == false}>LeaderBoard</Navlink>
              {!user.isPremium && (
                <Navlink showCrown={true}>Buy Premium</Navlink>
              )}
            </HStack>
            <Menu>
              <MenuButton
                as={Button}
                cursor={"pointer"}
                colorScheme="blackAlpha"
              >
                <FaUserCircle />
              </MenuButton>
              <MenuList>
                <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                  <Icon as={AiOutlineMail} />
                  {user.email}
                </MenuItem>
                <MenuDivider />
                <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                  <Icon as={user.isPremium ? PiCrownBold : FaUser} />
                  {user.isPremium ? "Premium" : "Freemium"} User
                </MenuItem>
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
                        Freemium User
                        <Icon as={FaUser} />
                      </>
                    )}
                  </Box>
                  <Divider />
                  <Navlink
                    showLock={!user.isPremium}
                    showReport={user.isPremium}
                  >
                    Reports
                  </Navlink>
                  <Navlink
                    showLock={!user.isPremium}
                    showLeaderBoard={user.isPremium}
                  >
                    LeaderBoard
                  </Navlink>
                  {!user.isPremium && (
                    <Navlink showCrown={true}>Buy Premium</Navlink>
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
    </nav>
  );
}
