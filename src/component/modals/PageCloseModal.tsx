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

import { AiOutlineCloseCircle } from "react-icons/ai";

type Props = {
  isOpen: boolean;
  toggleClose: any;
  loading: boolean;
};
const PageClose: FC<Props> = ({ isOpen,loading, toggleClose }) => {
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
                color={"red.500"}
                w={12}
                h={12}
                as={AiOutlineCloseCircle}
              />
              <Text>Test Closed</Text>

              <HStack
                my={4}
                flex={1}
                justifyContent={"center"}
                alignSelf={"center"}
              >

                <Button isLoading={loading} px={6} colorScheme="red" mr={3} onClick={toggleClose}>
                  End
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default PageClose;
