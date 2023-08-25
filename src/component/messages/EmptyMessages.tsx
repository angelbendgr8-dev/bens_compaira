import { Image, Text, VStack } from '@chakra-ui/react';
import React from 'react'

const EmptyMessages =() => {
  return (
    <VStack
      flex={1}
      // mt={{ base: '30%', lg: '30%' }}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Image
        alt="logo"
        fit={"contain"}
        boxSize={150}
        rounded="full"
        src={"/assets/images/message.png"}
      />
      <Text fontSize={{ base: 16 }} lineHeight={2} letterSpacing={2} fontWeight="400">
        Start your chat
      </Text>
    </VStack>
  );
}
export default EmptyMessages
