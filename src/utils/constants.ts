export const getBaseUrl = () => {

}

import {
  FaBookReader,
  FaUserGraduate,
  FaBriefcase,
  FaBusinessTime,
  FaUserCog,
  FaChalkboardTeacher,

} from "react-icons/fa";
import { HiUserGroup } from 'react-icons/hi'
export const profession = [
  {
    id: 1,
    name: "A Student",
    icon: FaBookReader,
    value: "student",
  },
  {
    id: 2,
    name: "A Graduate",
    icon: FaUserGraduate,
    value: "graduate",
  },
  {
    id: 3,
    name: "Working",
    icon: FaBriefcase,
    value: "working",
  },
  {
    id: 4,
    name: "Returning Professional",
    icon: FaBusinessTime,
    value: "returningProfessional",
  },
];
export const profession2 = [
  {
    name: "Technical",
    icon: FaUserCog,
    id: 1,
    value: "technical",
  },
  {
    name: "Non-Technical",
    icon: FaChalkboardTeacher,
    id: 2,
    value: "nontechnical",
  },
  {
    name: "Managerial",
    icon: HiUserGroup,
    id: 3,
    value: "managerial",
  },
];
export const notice = [
  {
    label: "1 Month",
    id: 1,
    value: "1",
  },
  {
    label: "3 Months",
    id: 2,
    value: "3",
  },
  {
    label: "6 Months",
    id: 3,
    value: "6",
  },
  {
    label: "12 Months",
    id: 3,
    value: "12",
  },
];
export const role = [
  {
    label: "Part-Time",
    value: "parttime",
  },
  {
    label: "Full-Time",
    value: "fulltime",
  },
  {
    label: "Temporary",
    value: "temporary",
  },
]
