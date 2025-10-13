import S from './index.module.scss'
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import remResponsive from "@/lib/rem-responsive";

type FloatingMarkProps = {
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
} & React.HTMLAttributes<HTMLDivElement>;

const FloatingMark = (props: FloatingMarkProps) => {
  const { children, ...rest } = props;
  const [ visible, setVisible ] = useState(false)

  useEffect(() => {
    const f = () => {
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const visible = scrollTop >= clientHeight
      setVisible(visible);
    }

    window.addEventListener('scroll', f);

    return () => {
      window.removeEventListener('scroll', f);
    }
  }, []);

  return <div {...rest} className={cx(S.sticky, rest.className, !visible && '!h-0 !overflow-hidden')}>
    {children}
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={S.toTop}
    >
      <TopIcon />
      <TopText />
    </Button>
  </div>
}

export default FloatingMark;

const DEFAULT_DIS = 12;

export function useFloatingMarkDistance() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = rootRef.current;
    if (!instance || !stickyRef.current) return

    const f = () => {
      if (!stickyRef.current) return

      calculateFixedDis(instance, stickyRef.current)
    }
    window.addEventListener('scroll', f)
    return () => {
      window.removeEventListener('scroll', f)
    }
  }, []);

  return {
    rootRef,
    stickyRef,
  }
}

export function calculateFixedDis(root: HTMLElement, target: HTMLElement) {
  const stickyWidth = target.clientWidth
  let left = root.getBoundingClientRect().right
  const windowWidth = document.documentElement.clientWidth;
  const instanceOffsetRight = windowWidth - left

  const rightBoundary = (instanceOffsetRight - stickyWidth) / 2;

  if (rightBoundary < 0) {
    target.style.right = remResponsive(3);
    target.style.removeProperty('left');
    return;
  }
  if (rightBoundary > DEFAULT_DIS) {
    left += DEFAULT_DIS;
  } else {
    left += rightBoundary;
  }

  target.style.left = left + 'px'
}

function TopIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="11"
    viewBox="0 0 18 11"
    fill="none"
  >
    <path
      d="M2 10.4297H0V8.42969H2V10.4297ZM18 10.4297H16V8.42969H18V10.4297ZM4 8.42969H2V6.42969H4V8.42969ZM16 8.42969H14V6.42969H16V8.42969ZM6 6.42969H4V4.42969H6V6.42969ZM14 6.42969H12V4.42969H14V6.42969ZM8 4.42969H6V2.42969H8V4.42969ZM12 4.42969H10V2.42969H12V4.42969ZM10 2.42969H8V0.429688H10V2.42969Z"
      fill="black"
    />
  </svg>
}

function TopText() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="8"
    viewBox="0 0 20 8"
    fill="none"
  >
    <path
      d="M5.71387 1.8584H3.57129V7.57227H2.14258V1.8584H0V0.429688H5.71387V1.8584ZM11.4287 7.57227H8.57129V6.14355H11.4287V7.57227ZM18.5713 1.8584H15.7139V4.71582H18.5713V6.14355H15.7139V7.57227H14.2861V0.429688H18.5713V1.8584ZM8.57129 6.14355H7.14258V1.8584H8.57129V6.14355ZM12.8574 6.14355H11.4287V1.8584H12.8574V6.14355ZM20 4.71582H18.5713V1.8584H20V4.71582ZM11.4287 1.8584H8.57129V0.429688H11.4287V1.8584Z"
      fill="black"
    />
  </svg>
}