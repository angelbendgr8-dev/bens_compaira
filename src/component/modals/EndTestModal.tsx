import {
  Box,
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
import { AiOutlineCloseCircle } from "react-icons/ai";

type Props = {
  isOpen: boolean;
  toggleClose: any;
};
const EndTest: FC<Props> = ({ isOpen, toggleClose }) => {
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={toggleClose}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody justifyContent={"center"} alignSelf={"center"}>
            <VStack>
              <Icon
                alignSelf={"center"}
                justifyContent={"center"}
                my={6}
                color={"red.500"}
                w={12}
                h={12}
                as={AiOutlineCloseCircle}
              />
              <Text>Do you want to submit answers?</Text>

              <HStack
                my={4}
                flex={1}
                justifyContent={"center"}
                alignSelf={"center"}
              >
                <Button colorScheme="gray" mr={3} onClick={toggleClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" mr={3} onClick={toggleClose}>
                  End
                </Button>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter flex={1}></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EndTest;
