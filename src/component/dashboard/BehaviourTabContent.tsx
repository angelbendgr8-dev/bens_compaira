import { useDashboard } from "@/state/hooks/dashboard.hook";
import { useProfile } from "@/state/hooks/profile.hook";
import { useAuth } from "@/state/hooks/user.hook";
import { setBehaviourGraphData } from "@/state/reducers/dashboard.reducer";
import { useGetBehaviourGraphMutation } from "@/state/services/dashboard.service";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import React, { useEffect, FC } from "react";
import { useDispatch } from "react-redux";
import { useEffectOnce } from "usehooks-ts";

type Props = {
  isLoading?: boolean,
};
const BehaviourTabContent: FC<Props> = ({ isLoading }) => {
  const [getBehaviourGraph] = useGetBehaviourGraphMutation();
  const { behaviourGraph } = useDashboard();
  const { profileData } = useProfile();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    getBehaviourGraph(profileData?.id)
      .unwrap()
      .then((payload) => {
        dispatch(setBehaviourGraphData({ data: payload }));
      });
  });
  useEffect(() => {
    console.log(behaviourGraph, "behaviour");
  }, [behaviourGraph]);

  return (
    <Box>
      <Button
        borderWidth={1}
        borderColor="primary.100"
        color="primary.100"
        bg="transparent"
        px={{
          base: 24,
        }}
      >
        Generate Report
      </Button>
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
          src={`${process.env.NEXT_PUBLIC_REACT_APP_API_URL}/uploads/graphs/${behaviourGraph}`}
        />
      </Flex>
    </Box>
  );
};
export default BehaviourTabContent;
