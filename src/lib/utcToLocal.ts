import dayjs from "dayjs";

export default function utcToLocal(dateStr: string) {
  return dayjs(dateStr).utc().local().format('YYYY/MM/DD')
}