


export default function ellipsis(text: string | undefined, head: number = 6, tail: number = 4) {
  if (!text) return "";
  const maxLength = head + tail;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, head)}...${text.slice(-tail)}`;
}