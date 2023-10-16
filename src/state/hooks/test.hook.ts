import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectJob, selectQuestion, selectTest } from "../reducers/test.reducer";


export const useTest = () => {
  const test = useSelector(selectTest);
  const job = useSelector(selectJob);
  const questions = useSelector(selectQuestion);
  return useMemo(
    () => ({ test, questions, job }),
    [test, questions, job]
  );
};
