import { useProfile } from "@/state/hooks/profile.hook";
import { Avatar, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import React, { FC } from "react";

type Props = {
  message: any;
  vacancy: any;
};
const MessageItem: FC<Props> = ({ message, vacancy }) => {
  const { profileData } = useProfile();
  const { message: text, messageBy, createdOn } = message;
  const { companyLogo } = vacancy;
  const { photo } = profileData;

  return (
    <Flex my={3} w="100%">
      <HStack
        // bg="red.300"
        w="100%"
        justifyContent={messageBy === "employer" ? "flex-start" : "flex-start"}
        flexDirection={messageBy === "employer" ? "row-reverse" : "row"}
      >
        {messageBy === "employer" ? (
          <Avatar
            size={"sm"}
            m={2}
            src={
              companyLogo
                ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${companyLogo}`
                : "http://cdn.onlinewebfonts.com/svg/img_148020.png"
            }
          />
        ) : (
          <Avatar
            size={"sm"}
            m={2}
            src={
              photo
                ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${photo}`
                : "http://cdn.onlinewebfonts.com/svg/img_148020.png"
            }
          />
        )}

        <Box maxW={"65%"}>
          <Box
            // bg={messageBy === "employer" ? "gray.400" : "#001B8F"}

            bgGradient={
              messageBy === "employer"
                ? "linear(gray.100 0%, gray.200 50%, gray.200 50%)"
                : "linear(primary.200 0%, primary.200 75%, primary.200 70%)"
            }
            borderLeftRadius={messageBy === "employer" ? "full" : "none"}
            borderRightRadius={messageBy === "employer" ? "none" : "full"}
            borderTopRightRadius={messageBy === "employer" ? "full" : "full"}
            borderTopLeftRadius={messageBy === "employer" ? "full" : "full"}
            py={3}
            px={4}
          >
            <Text
              letterSpacing={2}
              color={messageBy === "employer" ? "black" : "white"}
            >
              {text}
            </Text>
          </Box>
          <Text
            textAlign={messageBy === "employer" ? "right" : "left"}
            fontSize={10}
          >
            {moment(createdOn).format("MMM dd, yyyy HH:mm:ss")}
          </Text>
        </Box>
      </HStack>
    </Flex>
  );
};

export default MessageItem;
