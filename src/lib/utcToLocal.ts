import dayjs from "dayjs";

export default function utcToLocal(dateStr: string, format: string = "YYYY/MM/DD"): string {
  return dayjs(dateStr).utc().local().format(format);
}

export function localToUTC(dateStr?: string) {
  return dayjs(dateStr).utc()
}