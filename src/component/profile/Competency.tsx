import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState,useMemo } from "react";
import Slider from "./slider";
import { useProfile } from "@/state/hooks/profile.hook";
import { processBehaviour } from "@/utils/helpers";
import { size } from "lodash";
import { useSaveCompetencyDataMutation } from "@/state/services/profile.service";
import { useAuth } from "@/state/hooks/user.hook";
import moment from "moment";
import { setCompetencyData } from "@/state/reducers/profile.reducer";
import { useDispatch } from "react-redux";

const Competency = ({ changeTabs }: { changeTabs: any }) => {
  const { competencyData } = useProfile();
  const { user } = useAuth();
  const [behaviors, setBehaviors] = useState<any>([]);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const [saveCompetencyData] = useSaveCompetencyDataMutation();

  const dataLabels = [
    ["assertive", "followDirection"],
    ["opportunistic", "humanAware"],
    ["selfstart", "conflictManage"],
    ["managing", "conceptualThinking"],
    ["coordinating", "creative"],
    ["resultOrientation", "vision"],
    ["detailOrientation", "carelessness"],
    ["orderliness", "impulsive"],
    ["confronting", "confident"],
    ["networking", "qualityControl"],
    ["negotiating", "ruleAdherence"],
    ["risktaking", "observant"],
    ["strategic", "developingTeam"],
    ["balancedDecisionMaking", "relyData"],
    ["relyPeople", "delegate"],
    ["control", "leadFront"],
    ["leadPeople", "analytical"],
    ["emotional", "nodecisions"],
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

  useEffect(() => {
    if (size(competencyData) > 0) {
        console.log(behaviors, "competency");
      const keys = Object.keys(competencyData);
      const values = Object.values(competencyData);
      const vals = processBehaviour(keys, values);
      setBehaviors(vals);
    } else {
      setBehaviors(defaultValues);
    }
  }, [competencyData,defaultValues]);

  const labels = useMemo(
    () => [
      ["COORDINATING", "CREATIVE"],
      ["BALANCED DECISION MAKING", "SPONTANEOUS"],
      ["LEAD FROM THE FRONT", "LEAD THROUGH PEOPLE"],
      ["DELEGATE", "CONTROL"],
      ["STRATEGIC", "DEVELOPING TEAM"],
      ["DETAIL ORIENTATION", "DREAMER"],
      ["NEGOTIATING", "RULE ADHERENCE"],
      ["OPPORTUNISTIC", "HUMAN AWARENESS"],
      ["ANALYTICAL INTELLIEGENCE", "EMOTIONAL INTELLIGENCE"],
      ["ORDERLINESS", "IMPULSIVE"],
      ["RISK TAKING", "OBSERVANT"],
      ["PROBLEM SOLVING", "CONCEPTUAL THINKING"],
      ["RELY ON DATA", "RELY ON PEOPLE"],
      ["PERSUASIVE", "SELF CONTROL"],
      ["ASSERTIVE", "LISTENING"],
      ["PERFECTION", "EASY GOING"],
      ["RESULT ORIENTATION", "VISION"],
      ["GO GETTER", "CONFLICT MANAGEMENT"],
    ],
    []
  );
  const getResults = () => {
    let result: any = {};
    for (let i = 0; i < dataLabels.length; i++) {
      result[dataLabels[i][0]] = behaviors[i].first;
      result[dataLabels[i][1]] = behaviors[i].second;
      //  console.log(result);
    }
    saveCompetencyData({ username: user?.name, credentials: result })
      .unwrap()
      .then((payload) => {
        dispatch(setCompetencyData({ data: payload }));
      });

    changeTabs(3);
  };

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
        COMPETENCY SURVEY
      </Text>
      <Box my={6} rounded={"xl"} bg={"secondary.100"}>
        <Text fontSize={18} color={"black"} p={6}>
          {`We have provided a list of competencies which are opposite in nature.
          Move the cursor towards the competence that you think reflects you.
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
export default Competency;
