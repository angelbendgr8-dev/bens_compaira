import { useAuth } from "@/state/hooks/user.hook";
import { Avatar, Box, HStack, Link, Text } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { FC } from "react";
type Props = {
  vacancy: any;
  select: any;
  selected: any;
};
const ChatItem: FC<Props> = ({ vacancy, select, selected }) => {
  const { companyLogo, vacancyTitle, CompanyName } = vacancy;
  const router = useRouter();
  const { user } = useAuth();
  return (
    <Link
      _hover={{
        textDecoration:"none",
      }}
      borderBottomWidth={1}
      borderBottomColor='gray.300'
      onClick={() =>
        router.replace(`/messages/${user?.name}/${vacancy.vacancyId}`)
      }
    >
      <HStack
        mr={2}
        _hover={{
          bg: "blackAlpha.300",
          cursor: "pointer",
        }}
        bg={selected.vacancyId === vacancy.vacancyId ? "#A1CEEE" : "white"}
        onClick={() => select(vacancy)}
      >
        <Avatar
          size={"sm"}
          m={2}
          src={
            companyLogo
              ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${companyLogo}`
              : "http://cdn.onlinewebfonts.com/svg/img_148020.png"
          }
        />
        <Box>
          <Text fontWeight={"600"}>{vacancyTitle}</Text>
          <HStack justifyContent={"space-between"} mr={2}>
            <Text>{CompanyName}</Text>
            <Text>{moment().format("MM/DD/yyyy")}</Text>
          </HStack>
        </Box>
      </HStack>
    </Link>
  );
};

export default ChatItem;
