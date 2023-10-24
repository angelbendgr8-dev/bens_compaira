import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import { selectBehaviorGraph, selectCompetencyGraph, selectDashboard, selectVacancyTest } from '../reducers/dashboard.reducer';

export const useDashboard = () => {
  const dashboardData = useSelector(selectDashboard);
  const competencyGraph = useSelector(selectCompetencyGraph);
  const behaviourGraph = useSelector(selectBehaviorGraph);
  const vacancyTest = useSelector(selectVacancyTest);
  return useMemo(
    () => ({dashboardData,competencyGraph,behaviourGraph,vacancyTest}),
    [dashboardData, competencyGraph, behaviourGraph, vacancyTest],
  );
};
