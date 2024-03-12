import moment from "moment";

export default function useFormatDate() {
  const formatDateDMY = (date) => {
    return moment(date).utc().format("DD/MM/YYYY");
  };
  const formatDateDMYH = (date) => {
    return moment(date).format("DD/MM/YYYY hh:mm A");
  };
  const formatDateYMD = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const formatDateDM = (date) => {
    return moment(date).utc().format("DD/MM");
  };

  const formatDateYM = (date) => {
    return moment(date).format("YYYY-MM");
  };

  return {
    formatDateDMY,
    formatDateDMYH,
    formatDateYMD,
    formatDateDM,
    formatDateYM,
  };
}
