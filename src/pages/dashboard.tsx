import AnalyticsContainer from "@/component/dashboard/AnalyticsContainer";
import DashboardTab from "@/component/dashboard";
import AppLayouts from "@/layouts/AppLayouts";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { setCredentials } from "@/state/reducers/auth.reducer";
import { useDispatch } from "react-redux";
import { useAuth } from "@/state/hooks/user.hook";
import { useGetDashboardMutation } from "@/state/services/dashboard.service";
import { setDashbordData } from "@/state/reducers/dashboard.reducer";
import { isEmpty, map } from "lodash";
import {
  setBehaviourData,
  setCandidateFunctionAreas,
  setCandidateFunctionalSkills,
  setCandidateSectors,
  setCandidateTechnicalSkills,
  setCompetencyData,
  setFunctionAreas,
  setProfileData,
  setValuesData,
} from "@/state/reducers/profile.reducer";
import {
  useGetBehaviourDataQuery,
  useGetCandidateJobSectorsQuery,
  useGetCompetencyDataQuery,
  useGetFunctionAreasQuery,
  useGetFunctionalSkillsMutation,
  useGetProfileDataQuery,
  useGetTechnicalSkillsMutation,
  useGetValuesBenchmarkDataQuery,
} from "@/state/services/profile.service";
import { useDashboard } from "@/state/hooks/dashboard.hook";
import { useProfile } from "@/state/hooks/profile.hook";
import JobList from "@/component/dashboard/JobList";
import JobModal from "@/component/dashboard/JobModal";
import { useRouter } from "next/router";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token, user } = useAuth();
  const [getDashbardData] = useGetDashboardMutation();
  const { data, isLoading } = useGetProfileDataQuery(user?.name);
  const { data: behaviour, error} = useGetBehaviourDataQuery(user?.name);
  const { data: competency, error: compentencyError } = useGetCompetencyDataQuery(user?.name);
  const { data: valuesBenchmarks } = useGetValuesBenchmarkDataQuery(user?.name);
  const { data: jobSector } = useGetCandidateJobSectorsQuery(user?.name);
  const { data: functionalAreas } = useGetFunctionAreasQuery(user?.user);
  const { dashboardData } = useDashboard();
  const { behaviourData, competencyData, valuesData } = useProfile();
  const { jobList } = dashboardData;
  const [selected, setSelected] = useState<any>();
  const [showJobModal, setShowJobModal] = useState(false);
  const router = useRouter();

  const handleView = (job: any) => {
    setSelected(job);
    setShowJobModal(true);
  };

  useEffect(() => {
    const formData = {
      username: user?.name,
    };
    getDashbardData(formData)
      .unwrap()
      .then((payload) => {
        dispatch(setDashbordData({ data: payload }));
      });
  }, [getDashbardData,dispatch,user]);

  useEffect(() => {
    if (data) {
      dispatch(setProfileData({ data: data }));
    }
  }, [data,dispatch]);
  useEffect(() => {
    if (behaviour) {
      dispatch(setBehaviourData({ data: behaviour }));
    }
    if(error){
      console.log(error)
    }
  }, [behaviour,error,dispatch]);
  useEffect(() => {
    if (competency) {
      dispatch(setCompetencyData({ data: competency }));
    }
  }, [competency,dispatch]);
  useEffect(() => {
    if (valuesBenchmarks) {
      dispatch(setValuesData({ data: valuesBenchmarks }));
    }
  }, [valuesBenchmarks,dispatch]);

  useEffect(() => {
    if (functionalAreas) {
      dispatch(setFunctionAreas({ data: functionalAreas }));
    }
  }, [functionalAreas,dispatch]);

  useEffect(() => {
    if (jobSector) {
      dispatch(setCandidateSectors({ data: jobSector }));
    }
  }, [jobSector,dispatch]);

  return (
    <AppLayouts>
      <Box h={"200%"} mt={24}>
        <Box mb={8}>
          <AnalyticsContainer />
        </Box>
        <Box flex={1}>
          <Flex
            mb={2}
            direction={{
              base: "column",
              sm: "row",
              md: "row",
            }}
            gap={6}
            justify="flex-end"
          >
            {isEmpty(behaviourData) && (
              <Button
                bg={"blue.500"}
                _hover={{
                  bg: "blue.400",
                }}
                fontSize={{
                  base: 10,
                  sm: 10,
                  md: 12,
                  lg: 16,
                }}
                onClick={() => router.push("./profile/?tab=1")}
                color="white"
              >
                Complete Behaviour profile
              </Button>
            )}
            {isEmpty(competencyData) && (
              <Button
                bg={"blue.500"}
                _hover={{
                  bg: "blue.400",
                }}
                fontSize={{
                  base: 10,
                  sm: 10,
                  md: 12,
                  lg: 16,
                }}
                color="white"
                onClick={() => router.push("./profile/?tab=2")}
              >
                Complete Competency profile
              </Button>
            )}
            {isEmpty(valuesData) && (
              <Button
                bg={"blue.500"}
                _hover={{
                  bg: "blue.400",
                }}
                fontSize={{
                  base: 10,
                  sm: 10,
                  md: 12,
                  lg: 16,
                }}
                color="white"
                onClick={() => router.push("./profile/?tab=3")}
              >
                Complete Values Benchmark
              </Button>
            )}
          </Flex>
          <DashboardTab />
        </Box>
        {!isEmpty(jobList) && (
          <Box bg="white" mt={6} rounded={"lg"} py={4}>
            {map(jobList, (job, index) => (
              <JobList
                handleView={handleView}
                closeModal={setShowJobModal}
                key={index}
                job={job}
              />
            ))}
          </Box>
        )}
        {showJobModal && (
          <JobModal
            onClose={() => setShowJobModal(false)}
            open={showJobModal}
            job={selected}
          />
        )}
      </Box>
    </AppLayouts>
  );
}
