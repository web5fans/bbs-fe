export default function remResponsive(num: number) {
  return `calc(${num} / var(--flexible-design-size) * var(--flexible-size-unit))`
}