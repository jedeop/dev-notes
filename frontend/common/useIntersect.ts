import { useCallback, useEffect, useRef } from "react";

export default function useIntersect(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const callbackHandler = useCallback<IntersectionObserverCallback>((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback()
      }
    })
  }, [callback])

  useEffect(() => {
    if (!ref.current) return;

    let observer = new IntersectionObserver(callbackHandler, {
      rootMargin: '10px',
    });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, callback, callbackHandler])

  return ref;
}