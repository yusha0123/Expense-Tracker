import useOverlayStore from "@/hooks/useOverlayStore";
import {
  Button,
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
} from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineLogout } from "react-icons/hi";
import { PiCrownBold } from "react-icons/pi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Logo from "./Logo";
import Navlink from "./Navlink";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useOverlayStore();
  const {
    state: { user },
  } = useAuthContext();
  const { logout } = useLogout();

  const handleClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen("DRAWER");
    }
  };

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
              <Navlink showLock={user?.isPremium == false}>Reports</Navlink>
              <Navlink showLock={user?.isPremium == false}>LeaderBoard</Navlink>
              {!user?.isPremium && (
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
                  {user?.email}
                </MenuItem>
                <MenuDivider />
                <MenuItem display={"flex"} alignItems={"center"} gap={3}>
                  <Icon as={user?.isPremium ? PiCrownBold : FaUser} />
                  {user?.isPremium ? "Premium" : "Freemium"} User
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
            onClick={handleClick}
          />
        </Show>
      </Flex>
    </nav>
  );
}
