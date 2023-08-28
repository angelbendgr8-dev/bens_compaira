import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import Slider from "./Slider";
import { useProfile } from "@/state/hooks/profile.hook";
import { isEmpty,size } from "lodash";
import { processBehaviour } from "@/utils/helpers";
import { useSaveValuesBenchmarkDataMutation } from "@/state/services/profile.service";
import { useAuth } from "@/state/hooks/user.hook";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setValuesData } from "@/state/reducers/profile.reducer";
import { useRouter } from "next/router";

const ValuesTab = ({ changeTabs }: { changeTabs: any }) => {
  const { valuesData } = useProfile();
  // const [labels, setLabels] = useState<any>([]);
  const router= useRouter();
  const [saveValuesBenchmark] = useSaveValuesBenchmarkDataMutation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const dataLabels = [
    ["forceful", "obedient"],
    ["achievement", "helpful"],
    ["challenge", "diversity"],
    ["planning", "dreaming"],
    ["coherent", "creative"],
    ["reliable", "random"],
    ["precise", "nonConforming"],
    ["disciplined", "impulsive"],
    ["diligent", "freeThinking"],
    ["charming", "candid"],
    ["bold", "careful"],
    ["adventurous", "innocent"],
    ["equality", "favoritism"],
    ["respectful", "blunt"],
    ["loyal", "skeptical"],
    ["committed", "faithless"],
    ["tough", "empathetic"],
    ["fearful", "confident"],
  ];

  const defaultValues = useMemo(
    () => [
      { id: 1, first: 50, second: 50 },
      { id: 2, first: 50, second: 50 },
      { id: 3, first: 50, second: 50 },
      { id: 4, first: 50, second: 50 },
      { id: 5, first: 50, second: 50 },
      { id: 6, first: 50, second: 50 },
      { id: 7, first: 50, second: 50 },
      { id: 8, first: 50, second: 50 },
      { id: 9, first: 50, second: 50 },
      { id: 10, first: 50, second: 50 },
      { id: 11, first: 50, second: 50 },
      { id: 12, first: 50, second: 50 },
      { id: 13, first: 50, second: 50 },
      { id: 14, first: 50, second: 50 },
      { id: 15, first: 50, second: 50 },
      { id: 16, first: 50, second: 50 },
      { id: 17, first: 50, second: 50 },
      { id: 18, first: 50, second: 50 },
    ],
    []
  );
  const [behaviors, setBehaviors] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (!isEmpty(valuesData)) {

      const a = moment(valuesData.updatedOn);

      const b = moment();

      const diff = b.diff(a, "days");
      if (valuesData && diff > 365) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
      const keys = Object.keys(valuesData);
      const values = Object.values(valuesData);
      const vals = processBehaviour(keys, values);
      setBehaviors(vals);
    } else {
      console.log('novalues')
      setBehaviors(defaultValues);
    }
  }, [valuesData,defaultValues]);

  // useEffect(() => {
  //   const a = moment(valuesData.updatedOn);

  //   const b = moment();

  //   const diff = b.diff(a, "days");
  //   if (valuesData && diff > 365) {
  //     setDisabled(false);
  //   } else {
  //     setDisabled(true);
  //   }
  // }, [valuesData]);

  const getResults = () => {
    let result: any = {};
    for (let i = 0; i < dataLabels.length; i++) {
      result[dataLabels[i][0]] = behaviors[i].first;
      result[dataLabels[i][1]] = behaviors[i].second;
    }
    console.log(result,'form');
    saveValuesBenchmark({ username: user?.name, credentials: result })
      .unwrap()
      .then((payload: any) => {
        console.log(payload,'payload');
        dispatch(setValuesData({ data: payload }));
        router.replace('/dashboard')
      });
  };
  useEffect(() => {
    console.log(disabled);
  }, [behaviors]);

  const handleChange = (value: any, param: any) => {
    // console.log(item);

    if (value < 50) {
      setBehaviors(
        behaviors.map((item: any) => {
          return item.id === param.id
            ? { ...item, first: 50 - (50 - value), second: 50 - (value - 50) }
            : item;
        })
      );
    } else {
      setBehaviors(
        behaviors.map((item: any) => {
          return item.id === param.id
            ? { ...item, first: 50 + (value - 50), second: 50 + (50 - value) }
            : item;
        })
      );
    }
  };
  return (
    <Stack>
      <Text color="black" fontSize={30} fontWeight={"700"}>
        VALUES BENCHMARK
      </Text>
      <Box my={6} rounded={"xl"} bg={"secondary.100"}>
        <Text fontSize={18} color={"black"} p={6}>
         {` We have provided a list of behaviours which are opposite in nature.
          Move the cursor towards the behaviour that you think reflects you.
          Please remember there are no right or wrong answers. Once you complete
          the task, press " Save and continue " button.`}
        </Text>
      </Box>
      <Box>
        {size(behaviors) > 0 &&
          dataLabels.map((label: any, index: number) => (
            <Slider
              key={index}
              disabled={disabled}
              values={behaviors[index]}
              setValues={handleChange}
              labels={label}
            />
          ))}
      </Box>
      <Flex dir="row" justifyContent="center" gap={6}>
        <Button
          color="blackAlpha.500"
          textTransform={"uppercase"}
          w={{
            base: "50%",
            md: "40%",
            lg: "30%",
          }}
          fontWeight={"500"}
          py={6}
          bg="#B0B0B0"
        >
          Previous
        </Button>
        <Button
          w={{
            base: "50%",
            md: "40%",
            lg: "30%",
          }}
          bg="#32a7e1"
          onClick={getResults}
          fontWeight={"500"}
          py={6}
          _hover={{
            bg: "#1B76D2",
          }}
          color="white"
          textTransform={"uppercase"}
        >
          Save & continue
        </Button>
      </Flex>
    </Stack>
  );
};
export default ValuesTab;
