import { useDashboard } from "@/state/hooks/dashboard.hook";
import { useProfile } from "@/state/hooks/profile.hook";
import { useAuth } from "@/state/hooks/user.hook";
import {
  setBehaviourGraphData,
  setCompetencyGraphData,
} from "@/state/reducers/dashboard.reducer";
import {
  useGetBehaviourGraphMutation,
  useGetCompentecyGraphMutation,
} from "@/state/services/dashboard.service";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import React, { useEffect, FC } from "react";
import { useDispatch } from "react-redux";
import { useEffectOnce } from "usehooks-ts";
import { isEmpty } from "lodash";

type Props = {
  isLoading?: boolean;
};
const CompetencyTabContent: FC<Props> = ({ isLoading }) => {
  const [getCompetencyGrapph] = useGetCompentecyGraphMutation();
  const { competencyGraph } = useDashboard();
  const { profileData } = useProfile();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    if (!isEmpty(profileData?.id)) {
      getCompetencyGrapph(profileData?.id)
        .unwrap()
        .then((payload) => {
          dispatch(setCompetencyGraphData({ data: payload }));
        })
        .catch((error) => console.log(error));
    }
  });
  useEffect(() => {}, [competencyGraph]);

  return (
    <Box>
      <Flex
        display={{ base: "none", md: "block" }}
        bg="blue.500"
        flex={1}
        alignItems={"center"}
      >
        <Image
          alt="logo"
          fit={"contain"}
          boxSize={"full"}
          src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/uploads/graphs/${competencyGraph}`}
        />
      </Flex>
    </Box>
  );
};
export default CompetencyTabContent;
