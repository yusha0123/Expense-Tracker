import { useAuthContext } from "@/hooks/useAuthContext";
import { useError } from "@/hooks/useError";
import useOverlayStore from "@/hooks/useOverlayStore";
import { useUpgrade } from "@/hooks/useUpgrade";
import { Box, Icon } from "@chakra-ui/react";
import axios from "axios";
import { AiOutlineLock } from "react-icons/ai";
import { MdOutlineLeaderboard } from "react-icons/md";
import { PiCrownBold } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type NavLinkProps = {
  children: string;
  showLock?: boolean;
  showCrown?: boolean;
  showReport?: boolean;
  showLeaderBoard?: boolean;
};

const Navlink = ({
  children,
  showLock,
  showCrown,
  showReport,
  showLeaderBoard,
}: NavLinkProps) => {
  const {
    state: { user },
  } = useAuthContext();
  const navigate = useNavigate();
  const { upgrade } = useUpgrade();
  const { verify } = useError();
  const { onClose } = useOverlayStore();
  const [Razorpay] = useRazorpay();

  const handleNavclick = async (link: string) => {
    onClose();
    if (link == "Buy Premium" && !user?.isPremium) {
      try {
        const { data } = await axios.get("/api/premium/create-order", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (Razorpay) {
          handleOpenRazorPay(data);
        } else {
          toast.error("Razorpay failed to load!");
        }
      } catch (error) {
        verify(error);
      }
    } else if (!user?.isPremium) {
      toast.warning("Purchase premium membership!");
    } else {
      const Link = link.toLowerCase();
      navigate(`/${Link}`);
    }
  };

  const handleOpenRazorPay = (data: Order) => {
    const options = {
      key: import.meta.env.RAZOR_PAY_KEY,
      name: "Expensify",
      order_id: data.id,
      amount: data.amount_due.toString(),
      currency: data.currency,
      handler: async function (response: RazorpayResponse) {
        try {
          const { data } = await axios.post(
            "/api/premium/verify-order",
            response,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          if (data.success) {
            upgrade();
          }
        } catch (error) {
          verify(error);
        }
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on(
      "payment.failed",
      function (response: RazorpayPaymentFailedResponse) {
        toast.error(response.error.description);
      }
    );
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
