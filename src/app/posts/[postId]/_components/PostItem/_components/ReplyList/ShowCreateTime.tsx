import S from './index.module.scss'
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function ShowCreateTime({ created }: {
  created: string
}) {
  const [now, setNow] = useState(dayjs());
  const localTime = dayjs(created).utc().local()

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span className={S.time}>{localTime.from(now).replace(/\s/g, "")}</span>
}