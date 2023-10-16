import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC } from "react";
type Props = {
  open: boolean;
  job: any;
  onClose: any;
};
const JobModal: FC<Props> = ({job,open,onClose}) => {

  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={open}
        size={"4xl"}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent borderTopRadius="xl">
          <ModalHeader borderTopRadius="xl" py={4} color="white" bg="#2B2E7E">
            Job Description
          </ModalHeader>
          <ModalCloseButton rounded="full" bg={"white"} />
          <ModalBody>
            <Text fontSize={20} fontWeight={"bold"} color="black">
              {"Title"}: {job.title}
            </Text>
            <VStack alignItems={"flex-start"} my={2}>
              <Text fontSize={20} fontWeight={"bold"} color="black">
                Description
              </Text>
              <Text>{job.description}</Text>
            </VStack>
            <VStack alignItems={"flex-start"} my={2}>
              <Text fontSize={20} fontWeight={"bold"} color="black">
                Responsibilities
              </Text>
              <Text>{job.responsibilities}</Text>
            </VStack>
            <Flex dir="row">
              <VStack flex={1} alignItems={"flex-start"}>
                <Box>
                  <Text fontSize={18} fontWeight={"bold"}>
                    Job Type
                  </Text>
                  <Text textTransform={"capitalize"}>{job.jobType}</Text>
                </Box>
                <Box>
                  <Text fontWeight={"bold"}>Job Sector</Text>
                  <Text>{job.jobSector}</Text>
                </Box>
                <Box>
                  <Text fontWeight={"bold"}>Qualifications</Text>
                  <Text>{job.qualification}</Text>
                </Box>
              </VStack>
              <VStack flex={1} alignItems={"flex-start"}>
                <Box>
                  <Text fontWeight={"bold"} color="black">
                    Functional Skills
                  </Text>
                  <Text>{job.functionalSkillsMust}</Text>
                </Box>
                <Box>
                  <Text fontWeight={"bold"} color="black">
                    Technical Skills
                  </Text>
                  <Text>{job.techinicalSkillsMust}</Text>
                </Box>
              </VStack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default JobModal;
