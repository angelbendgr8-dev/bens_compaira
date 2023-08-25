import {
    Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
type Props = {
    isOpen: boolean,
    close: any,
}
const ConfirmModal: FC<Props> =({isOpen, close}) => {

  return (
    <>
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Email Notice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              An email has been sent to your registered email address to confirm
              your registration, Kindly click on the link provided to confirm
              your email.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={close}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default ConfirmModal
