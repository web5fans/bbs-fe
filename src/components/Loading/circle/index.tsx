import { createHighlights, svgLinesXY } from "./utils";
import { useEffect, useRef, useState } from "react";

export const Loading = ({ speed = 60, className }: { speed?: number; className?: string }) => {
  const { getIndexes, next } = createHighlights()
  const intervalRef = useRef<NodeJS.Timeout>(null)
  const [ highlight, setHighlight ] = useState<number[]>([])

  useEffect(() => {
    const f = () => {
      setHighlight(next())
    }
    setHighlight(getIndexes())
    intervalRef.current = setInterval(f, speed);

    return () => {
      if (!intervalRef.current) return
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, []);


  return <div>
    <svg
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 3V3H9H6V3V6H3V6V9V12V12H0V15V21H3V21V24V27V27H6V30V30H9H12V30V33H18H21V30V30H24H27V30V27H30V27V24V21V21H33V15V12H30V12V9V6V6H27V3V3H24H21V3V0H18H12V3ZM21 6V6H24H27V9V12V12H30V15V21H27V21V24V27H24H21V27V30H18H12V27V27H9H6V24V21V21H3V15V12H6V12V9V6H9H12V6V3H18H21V6Z"
        fill="#E7E7E7"
      />
      {svgLinesXY.map((item, index) => {
        const needLight = highlight.includes(index)

        return <line
          key={index}
          {...item}
          stroke="#319999"
          strokeWidth="3"
          className={needLight ? 'visible' : 'invisible'}
        />
      })}

      {/* 左侧1个像素 */}
      {/*<line*/}
      {/*  x1="1.5"*/}
      {/*  y1="12"*/}
      {/*  x2="1.5"*/}
      {/*  y2="21"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/* 左上角2个像素 */}
      {/*<line*/}
      {/*  x1="4.5"*/}
      {/*  y1="6"*/}
      {/*  x2="4.5"*/}
      {/*  y2="12"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/*<line*/}
      {/*  x1="12"*/}
      {/*  y1="4.5"*/}
      {/*  x2="6"*/}
      {/*  y2="4.5"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/* 正上方1个像素 */}
      {/*<line*/}
      {/*  x1="21"*/}
      {/*  y1="1.5"*/}
      {/*  x2="12"*/}
      {/*  y2="1.5"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}

      {/* 右上角2个像素 */}
      {/*<line*/}
      {/*  x1="27"*/}
      {/*  y1="4.5"*/}
      {/*  x2="21"*/}
      {/*  y2="4.5"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/*<line*/}
      {/*  x1="28.5"*/}
      {/*  y1="6"*/}
      {/*  x2="28.5"*/}
      {/*  y2="12"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/*右边1个像素*/}
      {/*<line*/}
      {/*  x1="31.5"*/}
      {/*  y1="12"*/}
      {/*  x2="31.5"*/}
      {/*  y2="21"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}

      {/* 右下角2个像素 */}
      {/*<line*/}
      {/*  x1="28.5"*/}
      {/*  y1="21"*/}
      {/*  x2="28.5"*/}
      {/*  y2="27"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/*<line*/}
      {/*  x1="27"*/}
      {/*  y1="28.5"*/}
      {/*  x2="21"*/}
      {/*  y2="28.5"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/* 正下方1个像素 */}
      {/*<line*/}
      {/*  x1="21"*/}
      {/*  y1="31.5"*/}
      {/*  x2="12"*/}
      {/*  y2="31.5"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}

      {/* 左下角2个像素 */}
      {/*<line*/}
      {/*  x1="12"*/}
      {/*  y1="28.5"*/}
      {/*  x2="6"*/}
      {/*  y2="28.5"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
      {/*<line*/}
      {/*  x1="4.5"*/}
      {/*  y1="21"*/}
      {/*  x2="4.5"*/}
      {/*  y2="27"*/}
      {/*  stroke="#319999"*/}
      {/*  stroke-width="3"*/}
      {/*/>*/}
    </svg>
  </div>
}