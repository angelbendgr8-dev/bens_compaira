import {
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { BsCheckCircleFill } from "react-icons/bs";

type Props = {
  isOpen: boolean;
  toggleClose: any;
};
const TestSuccess: FC<Props> = ({ isOpen, toggleClose }) => {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={toggleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Icon
                alignSelf={"center"}
                justifyContent={"center"}
                my={6}
                color={"green.500"}
                w={12}
                h={12}
                as={BsCheckCircleFill}
              />

              <Text>Thank You for completing the test assessment?</Text>

              <HStack
                my={4}
                flex={1}
                justifyContent={"center"}
                alignSelf={"center"}
              >
                <Button px={6} colorScheme="gray" mr={3} onClick={toggleClose}>
                  Close
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default TestSuccess;
