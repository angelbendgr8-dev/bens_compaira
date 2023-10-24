import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState } from "react";
import { map, isEmpty, padStart } from "lodash";
import { useCountdown, useEventListener, useIsFirstRender } from "usehooks-ts";
import PageClose from "@/component/modals/PageCloseModal";
import EndTest from "@/component/modals/EndTestModal";
import SubmitTest from "@/component/modals/SubmitTestModal";
import { useTest } from "@/state/hooks/test.hook";
import { useSubmitQuestionsMutation } from "@/state/services/test.service";
import { useAuth } from "@/state/hooks/user.hook";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { signOut } from "@/state/reducers/auth.reducer";
import { logout } from "@/state/services/awscognito.service";
import { useDispatch } from "react-redux";
import TestSuccess from "@/component/modals/SuccessTestModal";

type Props = {
  index: number;
  type?: string;
  active: number;
  gotoQuestion: any;
  question: any;
};
const TestCounter: FC<Props> = ({
  index,
  type = "unanswered",
  active = 0,
  gotoQuestion,
  question,
}) => {
  const colors = {
    answered: "green.700",
    unanswered: "gray.500",
    marked: "red.300",
  };
  useEffect(() => {}, [question]);

  return (
    <GridItem rounded="md" w="100%" h="10" bg="blue.500">
      <Button
        borderWidth={active === index ? 1 : 0}
        borderColor={"blue"}
        onClick={() => gotoQuestion(index)}
        color="white"
        //@ts-ignore
        bg={question.type ? colors[question.type] : colors[type]}
        w={"full"}
      >
        {index + 1}
      </Button>
    </GridItem>
  );
};
type QProps = {
  question: any;
  updateQestion?: any;
};
const CurrentQuestion: FC<QProps> = ({ question, updateQestion }) => {
  const [value, setValue] = useState(question?.answer);
  // console.log(question)
  const isFirst = useIsFirstRender();
  const selectAnswer = (answer: string) => {
    setValue(answer);
    updateQestion(answer);
  };
  useEffect(() => {
    if (isEmpty(question?.answer)) {
      setValue("");
    } else {
      setValue(question?.answer);
    }
  }, [question, value]);

  return (
    <Box>
      <Heading mb={4} size="md">
        {question?.question}
      </Heading>

      <RadioGroup onChange={(evt) => selectAnswer(evt)} value={value}>
        <Stack gap={6} direction="column">
          <Radio value="A">{question?.option1}</Radio>
          <Radio value="B">{question?.option2}</Radio>
          <Radio value="C">{question?.option3}</Radio>
          <Radio value="D">{question?.option4}</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

const TakeTest = () => {
  const { questions, test, job } = useTest();
  const { user, token } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [defaultQuestions, setDefaultQuestion] = useState(questions ?? []);
  const documentRef = useRef<Document>(document);
  const gotoNextQuestion = () => {
    // console.log(defaultQuestions.length, currentQuestion);
    if (currentQuestion + 1 <= defaultQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const router = useRouter();
  const [submit, { isLoading }] = useSubmitQuestionsMutation();
  const [pageClose, setPageClose] = useState(false);
  const [endTestVisible, setEndTestVisible] = useState(false);
  const [submitTestVisible, setSubmitTestVisible] = useState(false);
  const [intervalValue, setIntervalValue] = useState<number>(1000);
  const [successModal, setSuccessModal] = useState(false);
  const [testDone, setTestDone] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: (test?.duration ?? 0) * 60,
      intervalMs: intervalValue,
    });
  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  useEffect(() => {
    console.log(test);
    if (count <= 1) {
      submitTest();
    }
  }, [count]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    startCountdown();
  }, []);
  const onVisibilityChange = (event: Event) => {
    setPageClose(true);
    console.log("doc visibility changed!", {
      isVisible: !document.hidden,
      event,
    });
  };
  const handleBeforeUnload = (e: any) => {
    e.preventDefault();
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    console.log(message);
  };
  // example with document based event
  const closeTest = () => {

    endTest();
  };
  const endTest = () => {
    setEndTestVisible(false);
    let answers = defaultQuestions?.map((question: any) => {
      return {
        questionId: question.id,
        answer: question.answer,
      };
    });
    answers = answers.filter((answer: any) => !isEmpty(answer.answer));
    submit({
      username: user?.name,
      vacancyId: job.vacancyId,
      testId: test.testId,
      formData: answers,
    })
      .unwrap()
      .then((payload) => {
        console.log(payload);
        setPageClose(false);
        setSuccessModal(true);
      })
      .catch(() => {});
  };
  const showEndTest = () => {
    setEndTestVisible(true);
  };
  useEffect(() => {
    router.beforePopState(() => {
      // I only want to allow these two routes!
      //  if (as !== "/" && as !== "/other") {
      //    // Have SSR render bad routes as a 404.
      //    window.location.href = as;
      //    return false;
      //  }

      return testDone;
      console.log("poping");
    });
  }, [router]);
  const showSubmitTest = () => {
    setSubmitTestVisible(true);
  };
  const submitTest = () => {
    let answers = defaultQuestions?.map((question: any) => {
      return {
        questionId: question.id,
        answer: question.answer,
      };
    });
    answers = answers.filter((answer: any) => !isEmpty(answer.answer));
    submit({
      username: user?.name,
      vacancyId: job.vacancyId,
      testId: test.testId,
      formData: answers,
    })
      .unwrap()
      .then((payload) => {
        console.log(payload);
        setSubmitTestVisible(false);
        setSuccessModal(true);
      })
      .catch(() => {});
  };

  const goHome = () => {
    setSuccessModal(false);
    setTestDone(true);
    router.push("/dashboard");
  };
  useEventListener("visibilitychange", onVisibilityChange, documentRef);

  const gotoQuestion = (questionId: number) => {
    setCurrentQuestion(questionId);
  };
  const markCurrentQuestion = () => {
    setDefaultQuestion(
      defaultQuestions?.map((item: any) => {
        return item.id === defaultQuestions[currentQuestion].id
          ? { ...item, type: "marked" }
          : item;
      })
    );
  };

  const selectAnswer = (answer: string) => {
    setDefaultQuestion(
      defaultQuestions?.map((item: any) => {
        return item.id === defaultQuestions[currentQuestion].id
          ? { ...item, type: "answered", answer: answer }
          : item;
      })
    );
  };
  useEffect(() => {
    console.log(defaultQuestions);
  }, [defaultQuestions]);

  const formatTime = (time = 0) => {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time - hours * 3600) / 60);
    var seconds = time - hours * 3600 - minutes * 60;
    const formattedHours = padStart(hours.toFixed(0), 2, "0");
    const formattedMinutes = padStart(minutes.toFixed(0), 2, "0");
    const formattedSeconds = padStart(seconds.toFixed(0), 2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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
    <Card
      direction={{ base: "column" }}
      overflow="hidden"
      height={"100vh"}
      variant="outline"
      justifyContent={"space-between"}
    >
      <PageClose
        isOpen={pageClose}
        loading={isLoading}
        toggleClose={closeTest}
      />
      <EndTest isOpen={endTestVisible} toggleClose={endTest} />
      <TestSuccess isOpen={successModal} toggleClose={goHome} />
      <SubmitTest
        isOpen={submitTestVisible}
        loading={isLoading}
        toggleClose={() => setSubmitTestVisible(false)}
        confirmSubmit={submitTest}
      />
      <CardHeader borderBottomWidth={1}>
        <HStack justifyContent={"space-between"} flex={1}>
          <HStack>
            <Text color={"gray.500"}>
              Attempted{" "}
              <Box as={"span"} color="gray.600" fontWeight={"semibold"} ml={4}>
                {currentQuestion + 1}/{test.totalQuestions}
              </Box>
            </Text>
            <Text color={"gray.500"}>
              Time Left{" "}
              <Box as={"span"} color="gray.600" fontWeight={"bold"} ml={4}>
                {formatTime(count)}
              </Box>
            </Text>
          </HStack>
          <Image alt="logo" src={"/assets/images/app_logo.png"} />
          <HStack>
            <Button onClick={showSubmitTest} colorScheme="green">
              Submit Test
            </Button>
          </HStack>
        </HStack>
      </CardHeader>

      <HStack alignItems={"flex-start"} flex={1}>
        <CardBody h="full" my={12}>
          <Flex h="full">
            <VStack
              justifySelf={"center"}
              mx={12}
              flex={3}
              borderRightWidth={1}
              alignItems={"flex-start"}
              justifyContent={"start"}
            >
              <CurrentQuestion
                updateQestion={selectAnswer}
                question={defaultQuestions[currentQuestion]}
              />
            </VStack>
            <Box flex={1}>
              <Text color="gray.400">Test Progress</Text>
              <Grid my={4} templateColumns="repeat(8, 1fr)" gap={6}>
                {map(defaultQuestions, (item, index: number) => (
                  <TestCounter
                    active={currentQuestion}
                    question={item}
                    gotoQuestion={gotoQuestion}
                    index={index}
                    key={index}
                  />
                ))}
              </Grid>
            </Box>
          </Flex>
        </CardBody>
      </HStack>
      <CardFooter borderTopWidth={1}>
        <HStack alignItems={"center"} flex={1} justifyContent={"space-between"}>
          <Text>Compaira &copy;2023</Text>
          <HStack>
            <Tooltip hasArrow label="Go to previous question">
              <Button
                onClick={goBack}
                isDisabled={currentQuestion === 0}
                _disabled={{ bg: "gray.400" }}
                variant="solid"
                bg="purple.600"
                color="white"
              >
                Previous
              </Button>
            </Tooltip>
            {/* <Tooltip hasArrow label="Mark question for review">
              <Button
                onClick={markCurrentQuestion}
                variant="solid"
                colorScheme="orange"
                color="white"
              >
                Mark
              </Button>
            </Tooltip> */}
            <Tooltip hasArrow label="Goto next question">
              <Button
                isDisabled={currentQuestion + 1 === defaultQuestions.length}
                onClick={gotoNextQuestion}
                variant="solid"
                colorScheme="blue"
              >
                Next
              </Button>
            </Tooltip>
          </HStack>
        </HStack>
      </CardFooter>
    </Card>
  );
};
export default TakeTest;
