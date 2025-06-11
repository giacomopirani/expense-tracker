import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import ExpenseView from "../expense-view";
import Summary from "../summary";

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex textAlign={"center"} flexDirection={"column"} pr={"5"} pl={"5"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} mt={"12"}>
        <Heading
          color={"blue.400"}
          display={["none", "block", "block", "block", "block"]}
          fontWeight={"extrabold"}
        >
          Expense Tracker
        </Heading>
        <Flex alignItems={"center"}>
          <Button
            onClick={onOpen}
            bg={"blue.400"}
            color={"white"}
            ml={"4"}
            _hover={{
              bg: "blue.600",
              transform: "scale(1.05)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            Add New Transaction
          </Button>
        </Flex>
      </Flex>
      <Summary isOpen={isOpen} onClose={onClose} />

      <Flex
        w="full"
        alignItems={"flex-start"}
        justifyContent={"space-evenly"}
        flexDirection={["column", "column", "column", "row", "row"]}
      >
        <ExpenseView />
        <ExpenseView />
      </Flex>
    </Flex>
  );
}
