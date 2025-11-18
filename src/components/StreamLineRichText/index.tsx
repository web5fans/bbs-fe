'use client'

import { useEffect, useState } from "react";
import { postUriToHref } from "@/lib/postUriHref";
import Link from "next/link";

const StreamLineRichText = (props: {
  richText: string
  postUri?: string
  className?: string
}) => {
  const { richText, postUri, className } = props
  const [innerRichText, setInnerRichText] = useState('')

  useEffect(() => {
    if (!richText) return
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = richText;

    const imgTags = tempDiv.getElementsByTagName('img');

    // 将 HTMLCollection 转换为数组并进行处理
    Array.from(imgTags).forEach(img => {
      const span = document.createElement('span');
      span.textContent = '[图片]';
      img.parentNode?.replaceChild(span, img);
    });

    setInnerRichText(tempDiv.innerText)
  }, [richText]);

  const href = '/posts/' + postUriToHref(postUri || '')

  if (!postUri) {
    return <div className={className}>{innerRichText}</div>
  }

  return <Link href={href}>
    <div className={className}>{innerRichText}</div>
  </Link>
}

export default StreamLineRichText;