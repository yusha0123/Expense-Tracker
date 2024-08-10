import Navlink from "@/components/Navlink";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLogout } from "@/hooks/useLogout";
import useOverlayStore from "@/hooks/useOverlayStore";
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
  Icon,
  Show,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineMail } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { PiCrownBold } from "react-icons/pi";

const SideDrawer = () => {
  const { isOpen, onClose, type } = useOverlayStore();
  const {
    state: { user },
  } = useAuthContext();
  const { logout } = useLogout();

  return (
    <Show breakpoint="(max-width: 767px)">
      <Drawer
        isOpen={isOpen && type === "DRAWER"}
        placement="right"
        onClose={onClose}
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
                {user?.email}
                <Icon as={AiOutlineMail} />
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                {user?.isPremium ? (
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
                showLock={!user?.isPremium}
                showReport={!!user?.isPremium}
              >
                Reports
              </Navlink>
              <Navlink
                showLock={!user?.isPremium}
                showLeaderBoard={!!user?.isPremium}
              >
                LeaderBoard
              </Navlink>
              {!user?.isPremium && (
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
  );
};

export default SideDrawer;
