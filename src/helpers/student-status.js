import { studentStatusColor } from "../constants/studentStatus";

export const getStudentStatusColor = (statusId) => {
  return studentStatusColor[statusId] || "secondary";
};
