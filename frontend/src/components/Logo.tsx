import { useAuthStore } from "@/store/authStore";
import { Icon, Text } from "@chakra-ui/react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { Link } from "react-router-dom";

const Logo = () => {
  const { user } = useAuthStore();

  return (
    <Link to={user ? "/dashboard" : "/"}>
      <Text
        fontSize={{
          base: "xl",
          md: "2xl",
        }}
        as={"b"}
        display={"flex"}
        alignItems={"center"}
        cursor={"pointer"}
      >
        <Icon as={BiMoneyWithdraw} />
        Expensify
      </Text>
    </Link>
  );
};

export default Logo;
