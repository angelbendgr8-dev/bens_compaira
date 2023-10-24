import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  icon: any;
  title: string;
  onPress: ()=> void;
  active: boolean;
};
export const OptionCards: FC<Props> = ({ active, icon, onPress, title }) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={{
        base: "center",
      }}
      onClick={onPress}
      shadow={"lg"}
      boxShadow="md"
      borderWidth={active ? 2 : 0}
      borderColor={"primary.100"}
    //   flex={1}
      rounded={"lg"}
      pos="relative"
      flexDir={{
        base: "column",
      }}
      bg={"secondary.100"}
      minH={"80%"}
      maxH={"100%"}
      px={{
        base: 6,
      }}
    >
      <Flex
        bg={"white"}
        px={5}
        py={2}
        mt={4}
        mb={8}
        borderRadius={45}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {icon && (
          <Icon
            fontSize={{
              base: 54,
              lg: 48,
            }}
            color={"black"}
            as={icon}
          />
        )}
      </Flex>
      <Flex
        flexDir={"column"}
        justifyContent={"flex-end"}
        alignItems={{
          base: "center",
          md: "flex-end",
        }}
      >
        <Text
          fontSize={14}
          textAlign={"center"}
          fontWeight={"400"}
          color={"muted.500"}
          mb={{
            base: 8,
            md: 8,
          }}
        >
          {title}
        </Text>
      </Flex>
      <Box
        h={3}
        w={3}
        bottom={-2}
        bg={active ? "primary.100" : "transparent"}
        borderWidth={2}
        borderColor={active ? "primary.100" : "black"}
        rounded={"full"}
        position="absolute"
      />
    </Flex>
  );
};
