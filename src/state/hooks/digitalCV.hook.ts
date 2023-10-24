import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCvInfo } from "../reducers/digitalcv.reducer";

export const useDigitalCv = () => {
  const cvInfo = useSelector(selectCvInfo);
  return useMemo(() => ({ cvInfo }), [cvInfo]);
};
