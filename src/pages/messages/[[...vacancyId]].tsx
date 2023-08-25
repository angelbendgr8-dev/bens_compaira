import ChatList from "@/component/messages/ChatList";
import Messenger from "@/component/messages/Messenger";
import AppLayouts from "@/layouts/AppLayouts";
import { useMessages } from "@/state/hooks/messages.hook";
import { useAuth } from "@/state/hooks/user.hook";
import { setAllVacancies } from "@/state/reducers/message.reducer";
import {
  useGetAllVacanciesMutation,
  useGetIndividualMessagesMutation,
} from "@/state/services/messages.service";
import {
  Box,
  Flex,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Messages() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const { vacancyId } = router.query;

  const [getAllVacancies, { isLoading }] = useGetAllVacanciesMutation();
  const [getIndividualMessages] = useGetIndividualMessagesMutation();
  const { vacancies } = useMessages();
  const [selected, setSelected] = useState<any>({});
  const [conversations, setConversations] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getAllVacancies(user?.name)
      .unwrap()
      .then((payload) => {
        dispatch(setAllVacancies({ data: payload }));
      });
  }, [getAllVacancies, dispatch, user]);
  useEffect(() => {}, [vacancies, user]);

  const updateConversation = (message: string) => {
    console.log(message);
    setConversations([...conversations, message]);
  };

  const selectVacancy = (vacancy: any) => {
    setSelected(vacancy);
    setMessage("");
    setConversations([]);
    setVisible(false);
  };
  useEffect(() => {
    let id: string = selected?.vacancyId;
    if (vacancyId) {
      id = vacancyId![1] ?? selected?.vacancyId;
      console.log(id);
    }
    getIndividualMessages({
      username: user?.name,
      id,
    })
      .unwrap()
      .then((messages) => setConversations(messages));
  }, [vacancyId, selected, getIndividualMessages, user]);

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  return (
    <AppLayouts>
      <Flex
        // minH={{
        //   base: "100vh",
        //   lg: "82vh",
        // }}
        mt={24}
        p={0}
        // bg={"black"}
        rounded={"lg"}
        boxShadow={"md"}
        bg="white"
      >
        <Box
          minH={{
            base: "85vh",
            lg: "82vh",
          }}
          h="full"
          display={{
            base: visible ? "block" : "none",
            md: "block",
          }}
          w={{
            base: "100%",
            md: "34%",
          }}
          borderRightWidth={1}
          mx={0}
        >
          {isLoading ? (
            <>
              {[...Array(10)].map((_id, index) => (
                <Box
                  key={index}
                  flexDirection={"row"}
                  padding="2"
                  boxShadow="lg"
                  bg="white"
                >
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={2}
                    spacing="4"
                    skeletonHeight="2"
                  />
                </Box>
              ))}
            </>
          ) : (
            <ChatList selected={selected} select={selectVacancy} />
          )}
        </Box>
        <Box
          w="66%"
          // h={'102%'}
          // mx={0}
          display={{
            base: visible ? "none" : "block",
            md: "block",
          }}
          flex={1}
          minH={{
            base: "85vh",
            lg: "82vh",
          }}
          borderLeftWidth={1}
        >
          <Messenger
            toggleVisible={() => setVisible(true)}
            updateConversations={updateConversation}
            conversations={conversations}
            vacancy={selected}
          />
        </Box>
      </Flex>
    </AppLayouts>
  );
}
