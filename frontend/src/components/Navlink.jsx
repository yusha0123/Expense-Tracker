import { Box, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";
import axios from "axios";
import { AiOutlineLock } from "react-icons/ai";
import { MdOutlineLeaderboard } from "react-icons/md";
import { PiCrownBold } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useUpgrade } from "../hooks/useUpgrade";
import { useError } from "../hooks/useError";
import { toast } from "react-toastify";

const Navlink = ({
  children,
  showLock,
  showCrown,
  showReport,
  showLeaderBoard,
}) => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { upgrade } = useUpgrade();
  const { verify } = useError();

  const handleNavclick = async (link) => {
    // onClose();
    if (link == "Buy Premium" && !user.isPremium) {
      try {
        const { data } = await axios.get("/api/premium/create-order", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        handleOpenRazorPay(data);
      } catch (error) {
        verify(error);
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
          const { data } = await axios.post(
            "/api/premium/verify-order",
            response,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (data.success) {
            toast.success("You are now a Pro Member!");
          }
          dispatch({ type: "TOGGLE_CONFETTI" });
          upgrade();
        } catch (error) {
          verify(error);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

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
      {showReport && <Icon as={TbReportAnalytics} ml={1} />}
      {showLeaderBoard && <Icon as={MdOutlineLeaderboard} ml={1} />}
    </Box>
  );
};

export default Navlink;

Navlink.propTypes = {
  children: PropTypes.node.isRequired,
  showLock: PropTypes.bool,
  showCrown: PropTypes.bool,
  showReport: PropTypes.bool,
  showLeaderBoard: PropTypes.bool,
};
