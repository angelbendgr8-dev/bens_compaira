import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { FC } from "react";
type Props = {
    open: boolean,
    onClose: () => void
}
const Instruction: FC<Props> = ({open, onClose}) => {
  return (
    <>
      <Modal isCentered isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test Instruction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text >
                Clicking on start means you are have started the test. Leaving the test screen
                at any point will terminate the test taking process
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Instruction;
