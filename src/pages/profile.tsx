import ProfileTabs from "@/component/profile";
import Reminder from "@/component/profile/cards/Reminder";
import AppLayouts from "@/layouts/AppLayouts";
import { useAuth } from "@/state/hooks/user.hook";
import {
  setBehaviourData,
  setCandidateFunctionAreas,
  setCandidateFunctionalSkills,
  setCandidateProgress,
  setCandidateSectors,
  setCandidateTechnicalSkills,
  setCompetencyData,
  setFunctionAreas,
  setProfileData,
  setValuesData,
} from "@/state/reducers/profile.reducer";
import {
  useGetBehaviourDataQuery,
  useGetCandidateFunctionAreasMutation,
  useGetCandidateFunctionalSkillsMutation,
  useGetCandidateJobSectorsQuery,
  useGetCandidatePercentageQuery,
  useGetCandidateTechnicalSkillsMutation,
  useGetCompetencyDataQuery,
  useGetFunctionAreasQuery,
  useGetProfileDataQuery,
  useGetValuesBenchmarkDataQuery,
} from "@/state/services/profile.service";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { tab } = router.query;


  const { data: jobSector } = useGetCandidateJobSectorsQuery(user?.name);
  const { data, isLoading } = useGetProfileDataQuery(user?.name);
  const { data: functionalAreas } = useGetFunctionAreasQuery(user?.user);
  const { data: behaviour } = useGetBehaviourDataQuery(user?.name);
  const { data: competency } = useGetCompetencyDataQuery(user?.name);
  const { data: valuesBenchmarks } = useGetValuesBenchmarkDataQuery(user?.name);
  const { data: candidatePercentage } = useGetCandidatePercentageQuery(
    user?.name
  );

  const [getCandidateFunctionalSkills, { data: functionSkills }] =
    useGetCandidateFunctionalSkillsMutation();
  const [getCandidateTechnicalSkills, { data: technicalSkills }] =
    useGetCandidateTechnicalSkillsMutation();
  const [getCandidateFunctionalArea, { data: functionAreas }] =
    useGetCandidateFunctionAreasMutation();

  useEffect(() => {
    if (functionalAreas) {
      dispatch(setFunctionAreas({ data: functionalAreas }));
    }
  }, [functionalAreas, dispatch]);

  useEffect(() => {
    if (data) {
      console.log(data,'profile')
      dispatch(setProfileData({ data: data }));
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (candidatePercentage) {
      dispatch(setCandidateProgress({ data: candidatePercentage }));
    }
  }, [dispatch, candidatePercentage]);

  useEffect(() => {
    if (jobSector) {
      dispatch(setCandidateSectors({ data: jobSector }));
    }
  }, [jobSector, dispatch]);
  useEffect(() => {
    if (functionAreas) {
      getCandidateFunctionalSkills(user?.name)
        .unwrap()
        .then((payload: any) =>
          dispatch(setCandidateFunctionalSkills({ data: payload }))
        );
      getCandidateTechnicalSkills(user?.name)
        .unwrap()
        .then((payload: any) => {
          console.log(payload);
          dispatch(setCandidateTechnicalSkills({ data: payload }));
        });
    }
  }, [
    dispatch,
    functionAreas,
    getCandidateFunctionalSkills,
    getCandidateTechnicalSkills,
    user,
  ]);

  useEffect(() => {
    getCandidateFunctionalArea(user?.name)
      .unwrap()
      .then((payload: any) =>
        dispatch(setCandidateFunctionAreas({ data: payload }))
      );
  }, [dispatch, getCandidateFunctionalArea]);

  useEffect(() => {
    if (behaviour) {
      dispatch(setBehaviourData({ data: behaviour }));
    }
  }, [behaviour, dispatch]);
  useEffect(() => {
    if (competency) {
      dispatch(setCompetencyData({ data: competency }));
    }
  }, [competency, dispatch]);
  useEffect(() => {
    if (valuesBenchmarks) {
      dispatch(setValuesData({ data: valuesBenchmarks }));
    }
  }, [valuesBenchmarks, dispatch]);
  return (
    <AppLayouts>
      <Reminder />
      <Box mt={50}>
        <ProfileTabs tab={tab} />
      </Box>
    </AppLayouts>
  );
}
