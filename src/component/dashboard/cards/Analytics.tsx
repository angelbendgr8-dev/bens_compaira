import { Box, Flex, Icon, Text, Image } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
type Props = {
  icon: any;
  count: number;
  title: string;
  image: any;
  bg: string;
  iconColor: string;
};
export const Analytics: FC<Props> = ({
  icon,
  count,
  title,
  image,
  bg,
  iconColor,
}) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={{
        base: "center",
        sm: "space-between",
        lg: "space-between",
      }}
      shadow={"lg"}
      boxShadow="md"
      flex={1}
      borderBottomRadius={20}
      pos="relative"
      flexDir={{
        base: "column",
        sm: "row",
        lg: "row",
      }}
      bg={"white"}
      pt={{ base: 3 }}
      pb={{ base: 3 }}
      px={{
        base: 6,
      }}
    >
      <Image
        pos={"absolute"}
        bottom={0}
        left={0}
        bgSize={"lg"}
        src={image}
        alt="card background"
      />
      <Flex
        bg={bg}
        p={4}
        rounded="full"
        alignItems={"center"}
        justifyContent={"center"}
      >
        {icon && <Icon fontSize="48" color={iconColor} as={icon} />}
      </Flex>
      <Flex
        flexDir={"column"}
        justifyContent={"flex-end"}
        alignItems={{
          base: "center",
          md: "flex-end",
        }}
      >
        <Text fontSize={12} color={"muted.500"}>
          {title}
        </Text>
        <Text fontSize={48} fontWeight={"600"}>
          {count}
        </Text>
      </Flex>
    </Flex>
  );
};
