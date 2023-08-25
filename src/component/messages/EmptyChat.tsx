import { Box, Image, Text, VStack } from "@chakra-ui/react";

const EmptyChat = () => {
  return (
    <VStack
      flex={1}
      mt={{ base: 20, lg: 24 }}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        rounded="full"
        borderWidth={1}
        borderColor="muted.400"
        p={1}
      >
        <Image
          alt="logo"
          fit={"contain"}
          boxSize={150}
          borderWidth={1}
          borderColor="black"
          rounded="full"
          src={"/assets/images/noimage.jpg"}
        />
      </Box>
      <Text fontSize={{ base: 18 }} fontWeight="900">
        No messages yet
      </Text>
    </VStack>
  );
}
export default EmptyChat;
