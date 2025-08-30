'use client'

import ComputerCard from "@/app/register-login/(components)/ComputerCard";
import S from './index.module.scss'
import { useEffect, useState } from "react";
import cx from "classnames";

const cards = [0, 0.25, 0.5, 0.75, 1]

const CardLoading = (props: {
  name: string
  className?: string
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % 6);
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return <div className={cx(S.wrap, props.className)}>
    {cards.map((card, index) => {
      const flag = activeIndex > index
      return <ComputerCard
        className={S.cardItem}
        key={card}
        name={props.name}
        style={{ '--opacity': !flag ? 0 :card }}
        size={'sm'}
        disabled={!flag}
      />
    })}
  </div>
}

export default CardLoading;