import {
  Button,
  Flex,
  Icon,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineMail } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import ProgressTabContent from "./ProgressTabContent";
import BehaviourTabContent from "./BehaviourTabContent";
import CompentencyTabContent from "./CompetencyTabContent";
import {
  useGetBehaviourGraphMutation,
  useGetCompentecyGraphMutation,
  useGetDashboardMutation,
} from "@/state/services/dashboard.service";
import { useAuth } from "@/state/hooks/user.hook";
import { useDispatch } from "react-redux";
import {
  setBehaviourGraphData,
  setCompetencyGraphData,
  setDashbordData,
} from "@/state/reducers/dashboard.reducer";
import { isEmpty } from "lodash";
import { useProfile } from "@/state/hooks/profile.hook";
type Props = {
  children: React.ReactNode;
};
const DashboardTab = () => {
  const { user } = useAuth();
  const [getDashboardData] = useGetDashboardMutation();
  const [getCompetencyGrapph, { isLoading: competencyGraphLoading }] =
    useGetCompentecyGraphMutation();
  const [getBehaviourGraph, { isLoading: behaviorGraphLoading }] =
    useGetBehaviourGraphMutation();
  const dispatch = useDispatch();
  const { behaviourData, competencyData } = useProfile();
  /* eslint-disable react/display-name */
  const CustomTab = React.forwardRef(function (props: Props, ref) {
    // 1. Reuse the `useTab` hook
    // @ts-ignore
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig("Tabs", tabProps);

    return (
      <Button
        _pressed={{
          bg: "transparent",
        }}
        // bg={'blue.300'}
        flex={1}
        my={0}
        p={0}
        __css={styles.tab}
        {...tabProps}
      >
        <Flex
          bg={isSelected ? "tabActive.100" : "transparent"}
          color={isSelected ? "white" : "muted.200"}
          flexDir="row"
          my={0}
          h={12}
          borderBottomWidth={isSelected ? 2 : 0}
          borderBottomColor={"primary.50"}
          rounded="lg"
          alignItems="center"
          justifyContent={"center"}
        >
          {tabProps.children}
        </Flex>
      </Button>
    );
  });
  useEffect(() => {
    // if (!isEmpty(user)) {
    //   getDashboardData(user?.name)
    //     .unwrap()
    //     .then((payload) => {
    //       console.log(payload,'job spec')
    //       dispatch(setDashbordData({ data: payload }));
    //     }).catch((error)=> console.log(error, 'job spec'));
    // }
    getCompetencyGrapph(user?.name)
      .unwrap()
      .then((payload) => {
        dispatch(setCompetencyGraphData({ data: payload }));
      });
    getBehaviourGraph(user?.name)
      .unwrap()
      .then((payload) => {
        dispatch(setBehaviourGraphData({ data: payload }));
      });
  }, [
    getBehaviourGraph,
    getCompetencyGrapph,
    getDashboardData,
    dispatch,
    user,
  ]);

  return (
    <Tabs
      bg={"white"}
      boxShadow={"lg"}
      rounded={"lg"}
      minH={{
        base: "490",
      }}
    >
      <TabList
        bg="white"
        py={{
          base: 4,
        }}
        borderWidth={3}
        borderColor={"primary.50"}
        px={3}
        mb="1em"
        rounded="md"
      >
        <CustomTab>
          <Icon fontSize="20" as={HiOutlineCheckCircle} />
          <Text
            ml={{
              base: 1,
              md: 2,
            }}
            fontSize={{
              base: 8,
              md: 10,
              lg: 12
            }}
            fontWeight={"600"}
            textTransform={"uppercase"}
          >
            Progress
          </Text>
        </CustomTab>
        {!isEmpty(behaviourData) && (
          <CustomTab>
            <Icon fontSize="20" as={FaRegUserCircle} />
            <Text
              ml={{
                base: 1,
                md: 2,
              }}
              fontSize={{
                base: 8,
                md: 10,
                lg: 12
              }}
              fontWeight={"600"}
              textTransform={"uppercase"}
            >
              Behavioral Profile
            </Text>
          </CustomTab>
        )}
        {!isEmpty(competencyData) && (
          <CustomTab>
            <Icon fontSize="20" as={HiOutlineMail} />
            <Text
              ml={{
                base: 1,
                md: 2,
              }}
              fontSize={{
                base: 8,
                md: 10,
                lg: 12,
              }}
              fontWeight={"600"}
              textTransform={"uppercase"}
            >
              Competency Profile
            </Text>
          </CustomTab>
        )}
      </TabList>
      <TabPanels
        bg={"white"}
        h={"100%"}
        px={{
          base: 2,
          md: 8,
        }}
      >
        <TabPanel>
          <ProgressTabContent />
        </TabPanel>
        <TabPanel>
          <BehaviourTabContent />
        </TabPanel>
        <TabPanel>
          <CompentencyTabContent />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DashboardTab;
