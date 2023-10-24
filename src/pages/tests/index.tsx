import { useTest } from "@/state/hooks/test.hook";
import { useAuth } from "@/state/hooks/user.hook";
import { signOut } from "@/state/reducers/auth.reducer";
import { setQuestions } from "@/state/reducers/test.reducer";
import { logout } from "@/state/services/awscognito.service";
import { useGetQuestionsMutation } from "@/state/services/test.service";
import { Avatar, Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaCalendarDay, FaRegClock } from "react-icons/fa";
import { IoHourglassOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { isEmpty, shuffle } from "lodash";
import Instruction from "@/component/modals/Instruction";

const TestInstruction = () => {
  const { test, job } = useTest();
  const { user, token } = useAuth();
  const router = useRouter();
  const [getQuestions, { isLoading }] = useGetQuestionsMutation();
  const [questionSet, setQuestionSet] = useState(test?.questionsData);
  const dispatch = useDispatch();
  const [instruction, setInstruction] = useState(true)

  useEffect(() => {

  }, []);

  const startTest = () => {
    const shuffled = shuffle(questionSet);
    dispatch(setQuestions({ questions: shuffled }));
    router.push("/tests/take");
  };
  useEffect(() => {
    const verifyToken = () => {
      const decoded: any = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    };
    if (!token || !verifyToken()) {
      dispatch(signOut());
      logout();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isEmpty(token)) {
      router.push("/login");
    }
  }, [token, router, dispatch]);

  return (
    <Box>
      <Image alt="logo" src={"assets/images/app_logo.png"} />
      <VStack
        flex={1}
        alignItems="center"
        justifyContent={"center"}
        width={"100vw"}
        height="100vh"
      >
        <Instruction open={instruction} onClose={()=> setInstruction(false)}/>
        <HStack>
          <Avatar
            size={"xl"}
            m={4}
            src={
              job.companyLogo
                ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${job.companyLogo}`
                : "http://cdn.onlinewebfonts.com/svg/img_148020.png"
            }
          />
          <Text fontSize={{ base: "2xl", lg: "4xl" }} textAlign={"center"}>
            {job.companyName}
          </Text>
        </HStack>
        <Text fontSize={{ base: "xl", lg: "2xl" }} textAlign={"center"}>
          {job.title}
        </Text>
        <Text>anglbendgr8@gmail.com</Text>
        <VStack my={6}>
          <Text fontWeight="semibold">Test must be submitted by: </Text>
          <HStack>
            <FaCalendarDay />
            <Text fontStyle={"italic"}>
              {moment().format("dddd, DD MMM yyyy")}{" "}
            </Text>
          </HStack>
          <HStack>
            <FaRegClock />
            <Text fontStyle={"italic"}>{moment().format("HH:MM:a")} </Text>
          </HStack>
        </VStack>
        <HStack>
          <HStack fontStyle={"italic"}>
            <IoHourglassOutline fontWeight={"bold"} />
            <Text>
              <Box as="span" fontWeight="semibold">
                {test?.duration} minutes
              </Box>{" "}
              {` No overtime allowed`}
            </Text>
          </HStack>
        </HStack>
        <HStack>
          <Button isDisabled={isLoading} onClick={startTest} colorScheme="blue">
            {" "}
            Start Test
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
export default TestInstruction;
