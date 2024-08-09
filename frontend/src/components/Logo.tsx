import { Text, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BiMoneyWithdraw } from "react-icons/bi";
import { useAuthContext } from "../hooks/useAuthContext";

const Logo = () => {
  const { user } = useAuthContext();
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
