import moment from "moment";

export function formatDate(date: Date | string, format: string) {
  return moment(date).format(format);
}
