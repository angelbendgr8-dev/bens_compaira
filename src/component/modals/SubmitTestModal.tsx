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
import { IoWarning } from "react-icons/io5";

type Props = {
  isOpen: boolean;
  loading: boolean;
  toggleClose: any;
  confirmSubmit: any;
};
const SubmitTest: FC<Props> = ({
  isOpen,
  toggleClose,
  confirmSubmit,
  loading,
}) => {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={toggleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody borderRadius={"lg"}>
            <VStack>
              <Icon
                alignSelf={"center"}
                justifyContent={"center"}
                my={6}
                color={"yellow.500"}
                w={12}
                h={12}
                as={IoWarning}
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
                <Button isLoading={loading} colorScheme="red" mr={3} onClick={confirmSubmit}>
                  Submit
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SubmitTest;
