import { BigNumber } from "bignumber.js";

export function getCenterContentWidth(gridItemWidth: number = 88) {
  const docEl = document.documentElement;
  const clientWidth = window.innerWidth || docEl.getBoundingClientRect().width;
  const width = Math.min(clientWidth, 1440) - (35 * 2); // 左右margin最小36px
  const cols = Math.floor((width + 20) / (gridItemWidth + 20));

  const centerWidth = cols * gridItemWidth + (cols - 1) * 20

  return {
    centerWidth: Math.min(centerWidth, 1280),
    clientWidth
  }
}

export const shannonToCkb = (value: BigNumber | string | number): string => {
  if (!value) return "0";
  const bigValue =
    typeof value === "string" || typeof value === "number" || typeof value === "bigint"
      ? new BigNumber(value)
      : value;
  if (bigValue.isNaN()) {
    return "0";
  }
  const num = bigValue.dividedBy(new BigNumber("1e8"));
  if (num.abs().isLessThan(new BigNumber("1e-8"))) {
    return "0";
  }
  if (num.abs().isLessThan(new BigNumber("1e-6"))) {
    if (bigValue.mod(10).isEqualTo(0)) {
      return num.toFixed(7);
    }
    return num.toFixed(8);
  }
  return num.toString(); // `${}`
};