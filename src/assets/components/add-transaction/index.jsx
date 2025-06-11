import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

export default function TransactionForm({ onClose, isOpen }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Enter Description</FormLabel>
              <Input
                placeholder="Enter Transaction description"
                name="description"
                type="text"
              />
            </FormControl>
            <FormControl mt="4">
              <FormLabel>Enter Amount</FormLabel>
              <Input
                placeholder="Enter Transaction amount"
                name="amount"
                type="number"
              />
            </FormControl>
            <RadioGroup mt="5">
              <Radio value="income" colorScheme="blue" name="type">
                Income
              </Radio>
              <Radio value="expense" ml="2" colorScheme="red" name="type">
                Expense
              </Radio>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button mr={"4"} onClick={onClose}>
              Cancel
            </Button>
            <Button>Add</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
