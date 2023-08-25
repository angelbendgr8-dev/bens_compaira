import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { map } from "lodash";
import EmptyMessages from "./EmptyMessages";
import _, { isEmpty } from "lodash";
import { BsSendFill } from "react-icons/bs";
import MessageItem from "./MessageItem";
import { useAuth } from "@/state/hooks/user.hook";
import { AnyARecord } from "dns";
import { useSendMessageDataMutation } from "@/state/services/messages.service";
import { BiArrowBack } from "react-icons/bi";

type Props = {
  conversations: any;
  vacancy: any;
  updateConversations: any;
  toggleVisible: any;
};
const Messenger: FC<Props> = ({
  conversations,
  vacancy,
  updateConversations,
  toggleVisible,
}) => {
  const [messages, setMessages] = useState("");
  const toast = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<any>(null);
  const [sendMessageData] = useSendMessageDataMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (isEmpty(messages)) return;
    const message = {
      username: user?.name,
      employer: vacancy.CompanyName,
      vacancyId: vacancy.vacancyId,
      message: messages,
      messageBy: "candidate",
      seenStatus: 0,
      createdOn: new Date(),
    };
    sendMessageData({
      username: user?.name,
      credentials: {
        employer: vacancy.CompanyName,
        vacancyId: vacancy.vacancyId,
        message: messages,
        messageBy: "candidate",
        username: user?.name,
      },
    })
      .then((payload) => {
        console.log(payload);
        updateConversations(message);
        setMessages("");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "message failed",
          variant: "left-accent",
          status: "error",
          isClosable: true,
          position: "top-left",
        });
      });
  };

  useEffect(() => {
    console.log(conversations, "conversations");
    scrollToBottom();
  }, [conversations, vacancy]);

  return (
    <Box
      p={0}
      display={"flex"}
      flex={1}
      h={"100%"}
      minH={{
        base: "85vh",
        lg: "82vh",
      }}
      position={"relative"}
    >
      {_.isEmpty(conversations) ? (
        <Flex flex={1} h="full">
          <EmptyMessages />
        </Flex>
      ) : (
        <VStack flex={1} h={"100%"} w="100%">
          <HStack
            borderTopRadius={"md"}
            shadow={"2xl"}
            bgGradient="linear(blue.400 0%, blue.500 75%, blue.500 70%)"
            justifyContent={"space-between"}
            w="100%"
          >
            <HStack gap={2}>
              <Flex ml={2} alignItems="center">
                <Icon
                  onClick={toggleVisible}
                  fontSize="24"
                  color="white"
                  display={{
                    base: "block",
                    md: "none",
                  }}
                  as={BiArrowBack}
                />
                <Avatar
                  size={"sm"}
                  m={2}
                  src={
                    vacancy.companyLogo
                      ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${vacancy.companyLogo}`
                      : "http://cdn.onlinewebfonts.com/svg/img_148020.png"
                  }
                />
              </Flex>
              <Text color="white" fontSize={14} fontWeight={"600"}>
                {vacancy.CompanyName}
              </Text>
            </HStack>
            <Box bg={"blue.500"} opacity={0.5} rounded={"xl"} px={2} mr={3}>
              <Text color="white">{vacancy.vacancyId}</Text>
            </Box>
          </HStack>

          <Box
            flex={1}
            overflow={"auto"}
            px={4}
            pb={20}
            __css={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
            w="100%"
            maxH={{
              base: "75vh",
              lg: "72vh",
            }}
          >
            {!isEmpty(conversations) &&
              map(conversations, (conversation, index) => (
                <MessageItem
                  key={index}
                  message={conversation}
                  vacancy={vacancy}
                />
              ))}
            <div ref={messagesEndRef} />
          </Box>

          <HStack
            bg="#F2F2F2"
            justifyContent={"center"}
            w="100%"
            py={6}
            bottom={0}
            px={8}
            position={"absolute"}
          >
            <Input
              bg="white"
              rounded={"full"}
              value={messages}
              onChange={(input) => setMessages(input.target.value)}
              placeholder="Write a message"
              size="lg"
            />
            <Button
              bg={"white"}
              rounded={"full"}
              onClick={() => sendMessage()}
              p={2}
              variant="ghost"
              colorScheme="blue"
            >
              <Icon
                fontSize="24"
                color="linear(blue.400 0%, blue.500 75%, blue.500 70%)"
                as={BsSendFill}
              />
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default Messenger;
