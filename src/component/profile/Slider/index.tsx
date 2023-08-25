import {
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  useSlider,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useEffectOnce, useIsFirstRender } from "usehooks-ts";
type Props = {
  setValues: any;
  values: any;
  labels?: any;
  disabled?: boolean;
};

const Slider = ({
  setValues,
  disabled = false,
  values,
  labels,
}: Props) => {
  const {
    state,
    actions,
    getInnerTrackProps,
    getInputProps,
    getMarkerProps,
    getRootProps,
    getThumbProps,
    getTrackProps,
  } = useSlider({
    min: 0,
    max: 100,
    isReadOnly: disabled,
    defaultValue: values ? values.first : 50,
  });

  const { onKeyDown: onThumbKeyDown, ...thumbProps } = getThumbProps();
  //   const [value1, setValue1] = useState(50);
  //   const [value2, setValue2] = useState(50);

  const markers = [];
  for (let i = 1; i <= 3; i++) {
    markers.push(getMarkerProps({ value: i * 25 }));
  }
  const getInputinputProps = () => {};

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const { value, isDragging, isFocused } = state;
    setValues(value, values);

  }, [state.value]);

  useEffectOnce(() => {
    actions.stepTo(values?.first ?? 50);
  });
  useEffect(() => {}, [values]);

  return (
    <Box pos="relative" my={12} pt={4}>
      <Flex
        dir="row"
        w="100%"
        // zIndex={}
        top={-4}
        pos={"absolute"}
        justifyContent={"space-between"}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          w={"15%"}
          justifyContent={"center"}
          flexDir={"column"}
        >
          <Text
            fontSize={{
              base: 10,
              md: 12,
              lg: 14,
            }}
            textAlign={"center"}
            fontWeight={"500"}
            textTransform={"uppercase"}
            color="black"
          >
            {labels[0]}
          </Text>
          <Text
            mt={2}
            rounded={"md"}
            textAlign={"center"}
            color="white"
            bg="goldenrod"
            px={4}
          >
            {values?.first ?? 50}
          </Text>
        </Box>
        <Box
          w={"15%"}
          display={"flex"}
          alignItems={"center"}
          flexDir={"column"}
        >
          <Text
            fontSize={{
              base: 10,
              md: 12,
              lg: 14,
            }}
            textAlign={"center"}
            textTransform={"uppercase"}
            fontWeight={"500"}
            color="black"
          >
            {labels[1]}
          </Text>
          <Text
            my={2}
            textAlign={"center"}
            rounded={"md"}
            color="white"
            bg="goldenrod"
            px={4}
          >
            {values?.second ?? 50}
          </Text>
        </Box>
      </Flex>

      <chakra.div
        // mt={2}
        // px={8}
        mx="auto"
        alignSelf={"center"}
        cursor="pointer"
        w={{ base: "50%", lg: "70%" }}
        // px={{ base: "2%", lg: "10%" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} hidden />
        {/* {markers.map((markerProps, index) => {
          const value = String((index + 1) * 25) + "%";
          return (
            <Badge
              ml="-20px"
              mt="25px"
              fontSize="sm"
              color="#542344"
              {...markerProps}
            >
              {value}
            </Badge>
          );
        })} */}
        <Box h="7px" bgColor="#EBF5EE" borderRadius="full" {...getTrackProps()}>
          <Box
            h="5px"
            bgColor="primary.300"
            borderRadius="full"
            {...getInnerTrackProps()}
          />
        </Box>
        <Box
          top="1%"
          boxSize={8}
          bgColor="white"
          boxShadow="lg"
          borderWidth={5}
          borderColor="primary.300"
          borderRadius="full"
          _focusVisible={{
            outline: "none",
          }}
          // onKeyDown={(e) => {
          //   if (e.code === "ArrowRight") actions.stepUp(stepByNumber);
          //   else if (e.code === "ArrowLeft") actions.stepDown(stepByNumber);
          //   // @ts-ignore
          //   else onThumbKeyDown(e);
          // }}
          {...thumbProps}
        >
          <Tooltip
            label={state.value}
            hasArrow
            placement={"top"}
            aria-label="A tooltip"
          >
            <Flex
              w="100%"
              h="100%"
              alignItems="center"
              justifyContent="center"
            ></Flex>
          </Tooltip>
        </Box>
      </chakra.div>
    </Box>
  );
};
export default Slider;
