import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectBehaviorData,
  selectCandidateFunctionAreas,
  selectCandidateFunctionalSkills,
  selectCandidateProgress,
  selectCandidateSectors,
  selectCandidateTechnicalSkills,
  selectCompetencyData,
  selectFunctionAreas,
  selectFunctionSkills,
  selectProfileData,
  selectSectors,
  selectTechnicalSkills,
  selectValuesData,
} from "../reducers/profile.reducer";

export const useProfile = () => {
  const profileData = useSelector(selectProfileData);
  const behaviourData = useSelector(selectBehaviorData);
  const competencyData = useSelector(selectCompetencyData);
  const valuesData = useSelector(selectValuesData);
  const functionAreas = useSelector(selectFunctionAreas);
  const sectors = useSelector(selectSectors);
  const technicalSkills = useSelector(selectTechnicalSkills);
  const functionalSkills = useSelector(selectFunctionSkills);
  const candidateFunctionAreas = useSelector(selectCandidateFunctionAreas);
  const candidateSectors = useSelector(selectCandidateSectors);
  const candidateTechnicalSkills = useSelector(selectCandidateTechnicalSkills);
  const candidateFunctionalSkills = useSelector(
    selectCandidateFunctionalSkills
  );
  const candidateProgress = useSelector(selectCandidateProgress);
  return useMemo(
    () => ({
      profileData,
      valuesData,
      behaviourData,
      competencyData,
      functionAreas,
      sectors,
      technicalSkills,
      functionalSkills,
      candidateFunctionAreas,
      candidateSectors,
      candidateTechnicalSkills,
      candidateFunctionalSkills,
      candidateProgress,
    }),
    [
      profileData,
      valuesData,
      behaviourData,
      competencyData,
      functionAreas,
      sectors,
      technicalSkills,
      functionalSkills,
      candidateFunctionAreas,
      candidateSectors,
      candidateTechnicalSkills,
      candidateFunctionalSkills,
      candidateProgress,
    ]
  );
};
