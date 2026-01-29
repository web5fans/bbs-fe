import { useEffect, useRef } from "react";
import { DotLoading } from "@/components/Loading";

export default function LoadMoreView({ onLoadMore }: { onLoadMore: () => void }) {

  const ref = useRef(null);
  const cbRef = useRef<() => void>(null);
  cbRef.current = onLoadMore;
  useEffect(() => {
    if (!ref.current) return;
    const listener: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        cbRef.current?.();
      }
    }
    const target = new IntersectionObserver(listener, {
      rootMargin: '0px 0px 80px 0px',
    });
    target.observe(ref.current)
    return () => {
      target.disconnect();
    }

  }, [])

  return (
    <div ref={ref} className={'text-center'}>
      <DotLoading className={'text-[20px] text-[green]'} />
    </div>
  )
}