import { Box, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";

import { BsArrowRightShort, BsHeart } from "react-icons/bs";
import {
  FaRegStickyNote,
  FaUsers,
  FaChartPie,
  FaPuzzlePiece,
  FaHeart,
} from "react-icons/fa";
import { Progress } from "./cards/Progress";

const ProgressTabContent = () => {
  return (
    <Box>
      <Flex flexDir={"row"}>
        <Icon fontSize="36" as={BsArrowRightShort} />
        <Text
          fontWeight={"500"}
          fontSize={{
            base: 16,
            md: 18,
            lg: 20,
          }}
        >
          The screening process has five stages. They are all given below, when
          you clear a particular stage that icon will appear next to the role
          here.
        </Text>
      </Flex>

      <SimpleGrid
        columns={{
          base: 1,
          sm: 2,
          lg: 5,
          xl: 5,
        }}
        my={{
          base: 4,
        }}
        spacing={6}
      >
        <Progress
          icon={FaRegStickyNote}
          title="CV Match"
          bg="white"
          iconColor="#32A7E1"
          count={0}
        />
        <Progress
          icon={BsHeart}
          title="Skill Match"
          count={0}
          bg="white"
          iconColor="#EF8F41"
        />
        <Progress
          icon={FaUsers}
          title="Behavior Match"
          count={0}
          bg="white"
          iconColor="#2F947B"
        />
        <Progress
          icon={FaChartPie}
          title="Competence Match"
          count={0}
          bg="white"
          iconColor="#5E5C9A"
        />
        <Progress
          icon={FaPuzzlePiece}
          title="Aptitude Match"
          count={0}
          bg="white"
          iconColor="#2C2E7E"
        />
      </SimpleGrid>
    </Box>
  );
}

export default ProgressTabContent
