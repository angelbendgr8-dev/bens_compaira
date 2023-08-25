import { useAuth } from "@/state/hooks/user.hook";
import {
  useApplyVacancyMutation,
  useDeleteVacancyMutation,
  useRejectVacancyMutation,
} from "@/state/services/dashboard.service";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { map, isEmpty } from "lodash";
import { FaUsers, FaChartPie, FaPuzzlePiece, FaHeart } from "react-icons/fa";
import { BsBriefcaseFill, BsClockFill } from "react-icons/bs";
import { RiStickyNoteFill } from "react-icons/ri";
type Props = {
  job: any;
  closeModal: any;
  handleView: any;
};
const JobList: FC<Props> = ({ job, closeModal, handleView }) => {
    const {
      vacancyId,
      title,
      cvScore,
      fSkillsScore,
      tSkillsScore,
      behaviourScore,
      competencyScore,
      qualification,
      functionalSkills,
      responsibilities,
      description,
      status,
      jobSector,
      jobType,
      tests,
      desc,
      // status,
      // desired,
      technicalSkills,
      companyLogo,
      handleApply,
    } = job;
  const [applyVacancy] = useApplyVacancyMutation();
  const [rejectVacancy] = useRejectVacancyMutation();
  const [deleteVacancy] = useDeleteVacancyMutation();
  const toast = useToast();
  const { user } = useAuth();
  const [apply, setApply] = useState(false);
  const [isCandidateFit, setIsFit] = useState(false);
  const [testDone, setTestDone] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isFit =
      cvScore > 0 &&
      fSkillsScore > 0 &&
      tSkillsScore > 0 &&
      behaviourScore > 0 &&
      competencyScore > 0;
    setIsFit(isFit);
  }, [behaviourScore, competencyScore,cvScore,fSkillsScore,tSkillsScore]);
  useEffect(() => {
    let testIsDone: any = [];
    map(tests, (test) => {
      if (test.done === "false") {
        testIsDone = [...testIsDone, "false"];
      } else {
        // testIsDone = [...testIsDone, 'a'];
        // console.log('errr');
      }
    });
    setTestDone(testIsDone);
  }, [tests]);


  const handleRemove = () => {
    const formData = {
      choice: "hide",
      vacancyId: vacancyId,
      candidateUsername: user?.name,
    };
    if (status === "hide") {
      deleteVacancy({ username: user?.name, credential: formData });
    } else rejectVacancy({ username: user?.name, credential: formData });
  };

  const onApply = () => {
    const formData = {
      choice: "hide",
      vacancyId: vacancyId,
      candidateUsername: user?.name,
    };
    if (isCandidateFit) {
      applyVacancy({ username: user?.name, credential: formData });
      setApply(true);
    }
    if (!(tSkillsScore > 0) && !(fSkillsScore > 0)) {
      toast({
        title: "Skills doesnt match",
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
    if (cvScore > 0) {
      toast({
        title: "CV score doesnt match",
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
    if (!(behaviourScore > 0)) {
      toast({
        title: "Behaviour profile doesnt match",
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
    if (!(competencyScore > 0)) {
      toast({
        title: "Competency profile doesnt match",
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
    if (isCandidateFit && !isEmpty(testDone)) {
      toast({
        title: "Kindly complete tests to proceed further with application ",
        variant: "left-accent",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <HStack>
      <Avatar
        size={"xl"}
        m={4}
        src={
          companyLogo
            ? `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/${companyLogo}`
            : "http://cdn.onlinewebfonts.com/svg/img_148020.png"
        }
      />
      <Box>
        <Text
          fontSize={24}
          w={{
            base: "100%",
            lg: "65%",
          }}
          my={2}
          fontWeight={"bold"}
          color="black"
        >
          {title}
        </Text>
        <HStack>
          <Icon fontSize="14" color="muted.200" as={BsBriefcaseFill} />
          <Text>{jobSector}</Text>
        </HStack>
        <HStack>
          <Icon fontSize="14" color="muted.200" as={BsClockFill} />
          <Text>{jobType}</Text>
        </HStack>
        <VStack alignItems={"flex-start"}>
          {apply && (
            <HStack
              spacing={6}
              my={1}
              flex={1}
              justifyContent={"space-between"}
            >
              <Icon
                fontSize="36"
                color={cvScore > 0 ? "#078f78" : "#ef5350"}
                as={RiStickyNoteFill}
              />
              <Icon
                fontSize="36"
                color={
                  tSkillsScore > 0 && fSkillsScore > 0 ? "#078f78" : "#ef5350"
                }
                as={FaHeart}
              />
              <Icon
                fontSize="36"
                color={behaviourScore > 0 ? "#078f78" : "#ef5350"}
                as={FaChartPie}
              />
              <Icon
                fontSize="36"
                color={competencyScore > 0 ? "#078f78" : "#ef5350"}
                as={FaUsers}
              />
              <Icon
                fontSize="36"
                color={isEmpty(testDone) ? "#078f78" : "#ef5350"}
                as={FaPuzzlePiece}
              />
            </HStack>
          )}
          <Flex my={2} gap={2} justify="flex-start">
            <Button
              bg={"blue.300"}
              onClick={() => handleView(job)}
              _hover={{
                bg: "blue.400",
              }}
              fontSize={14}
              color="white"
            >
              View details
            </Button>
            {!(status === "shortlist") &&
              !(status === "applied") &&
              !(status === "hide") && (
                <Button
                  bg={"green.300"}
                  _hover={{
                    bg: "green.400",
                  }}
                  onClick={onApply}
                  fontSize={14}
                  color="white"
                >
                  Apply
                </Button>
              )}

            <Button
              bg={`${
                status === "hide"
                  ? "#078f78"
                  : status === "rejected"
                  ? ""
                  : "#ee6f57"
              }`}
              isDisabled={isLoading || status === "rejected"}
              _hover={{
                bg: `${
                  status === "hide"
                    ? "#078f78"
                    : status === "rejected"
                    ? ""
                    : "#ee6f57"
                }`,
              }}
              onClick={handleRemove}
              fontSize={14}
              color="white"
            >
              {status === "hide" ? "Rejected" : "Reject"}
            </Button>
            {status === 'shortlist' && (
            <Button
              bg={"#302F3D"}
              textTransform="capitalize"
              isDisabled={isLoading || status === "rejected"}
              _hover={{
                bg: "#302F3D",
              }}
              onClick={handleRemove}
              fontSize={14}
              color="white"
            >
              Shortlisted
            </Button>
            )}
          </Flex>
        </VStack>
      </Box>
    </HStack>
  );
};

export default JobList;
