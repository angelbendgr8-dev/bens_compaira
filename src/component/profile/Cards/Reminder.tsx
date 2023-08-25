import { useProfile } from "@/state/hooks/profile.hook";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useEffectOnce } from "usehooks-ts";
import {isEmpty} from 'lodash';

const Reminder = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { candidateProgress } = useProfile();
  const btnRef = React.useRef();
  useEffectOnce(() => {
    if (!isEmpty(candidateProgress) && candidateProgress.completionPercentage < 100) {
      onOpen();
    }
  });
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        //@ts-ignore
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <VStack m={8}>
            <Text>
             {`We want you to be successful and make this your home for work, and
              one of the most important tools for success is your profile. Over
              the years, we’ve found that the most successful freelancers have
              profiles that are complete, accurate, and paint a compelling
              picture of their services, skills, and accomplishments.`}
            </Text>
            <Box width={"25%"}>
              <Text fontWeight={'bold'}>
                Profile Completeness: {candidateProgress.completionPercentage} %
              </Text>
              <Slider
                aria-label="slider-ex-1"
                defaultValue={candidateProgress.completionPercentage}
              >
                <SliderTrack>
                  <SliderFilledTrack bg="green.100" />
                </SliderTrack>
                <SliderThumb boxSize={6} bg="green.300" />
              </Slider>
            </Box>
          </VStack>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Reminder;
