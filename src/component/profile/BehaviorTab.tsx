import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import Slider from "./slider";
import { useProfile } from "@/state/hooks/profile.hook";
import { size } from "lodash";
import { processBehaviour } from "@/utils/helpers";
import { useSaveBehaviourDataMutation } from "@/state/services/profile.service";
import { useAuth } from "@/state/hooks/user.hook";
import moment from "moment";
import { setBehaviourData } from "@/state/reducers/profile.reducer";
import { useDispatch } from "react-redux";
import { useIsMounted } from "usehooks-ts";

const BehaviorTab = ({ changeTabs }: { changeTabs: any }) => {
  const { behaviourData } = useProfile();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  // const [labels, setLabels] = useState<any>([]);
  const [saveBehaviorData] = useSaveBehaviourDataMutation();
  const dataLabels = [
    ["authoritarian", "flattering"],
    ["prospecting", "sympathetic"],
    ["competitive", "harmonising"],
    ["planning", "visionary"],
    ["organising", "creative"],
    ["achieving", "visualiser"],
    ["pedantic", "hedonistic"],
    ["standardising", "impetuous"],
    ["critical", "charismatic"],
    ["influencing", "preventative"],
    ["pioneering", "preserving"],
    ["dareDevil", "watchful"],
    ["strategic", "encouraging"],
    ["purposeful", "spontaneous"],
  ];

  const defaultValues = useMemo(() => [
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
  ], [])
  const [behaviors, setBehaviors] = useState<any>([]);
  useEffect(() => {
    if (size(behaviourData) > 0) {
      console.log(behaviourData,'behaviour');

      const keys = Object.keys(behaviourData);
      const values = Object.values(behaviourData);
      const vals = processBehaviour(keys, values);
      setBehaviors(vals);
    } else {
      setBehaviors(defaultValues);
    }
  }, [behaviourData,defaultValues]);

  const labels = useMemo(
    () => [
      ["AUTHORITARIAN", "FLATTERING"],
      ["PROSPECTING", "SYMPATHETIC"],
      ["COMPETITIVE", "HARMONISING"],
      ["PLANNING", "VISIONARY"],
      ["ORGANISING", "CREATIVE"],
      ["ACHIEVING", "VISUALISER"],
      ["NITPICKING", "HEDONISTIC/SELF-INDULGENT"],
      ["STANDARDISING", "IMPETUOUS"],
      ["CRITICAL", "CHARISMATIC"],
      ["INFLUENCING", "PREVENTATIVE"],
      ["PIONEERING", "PRESERVING"],
      ["DARE DEVIL", "WATCHFUL"],
      ["STRATEGIC", "ENCOURAGING"],
      ["PURPOSEFUL", "SPONTANEOUS"],
    ],
    []
  );
  useEffect(() => {
    console.log(behaviors)
  }, [behaviors])


  const getResults = () => {
    let result: any = {};
    for (let i = 0; i < dataLabels.length; i++) {
      result[dataLabels[i][0]] = behaviors[i].first;
      result[dataLabels[i][1]] = behaviors[i].second;
      //  console.log(result);
    }
    saveBehaviorData({ username: user?.name, credentials: result })
      .unwrap()
      .then((payload) => {
        dispatch(setBehaviourData({ data: payload }));
      });

    changeTabs(2);
  };
  useEffect(() => {
    // console.log(labels);
  }, [labels, behaviors]);


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
        BEHAVIOUR SURVEY
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
          labels.map((label: any, index: number) => (
            <Slider
              key={index}
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
export default BehaviorTab;
