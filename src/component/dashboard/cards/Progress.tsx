import { Box, Flex, Icon, Text, Image } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
type Props = {
  icon: any;
  count: number;
  title: string;
  bg: string;
  iconColor: string;
};
export const Progress: FC<Props> = ({ icon, count, title, bg, iconColor }) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={{
        base: "center",
      }}
      shadow={'lg'}
      boxShadow='md'
      flex={1}
      rounded={'lg'}
      pos="relative"
      flexDir={{
        base: "column",
      }}

      bg={"secondary.100"}
      py={{
        base: 8,
        md: 8
      }}
      px={{
        base: 6,
      }}
    >
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
        <Text fontSize={18} textAlign={'center'} fontWeight={'600'} color={"muted.500"}>
          {title}
        </Text>

      </Flex>
    </Flex>
  );
};
