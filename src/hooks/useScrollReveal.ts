import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        // Small RAF delay so the browser has a frame to paint before animating
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
        if (once && ref.current) {
          entry.target && (entry.target as HTMLElement).style.setProperty('will-change', 'auto');
        }
      } else if (!once) {
        setIsVisible(false);
      }
    },
    [once]
  );

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Hint the browser that these properties will animate
    currentRef.style.willChange = 'opacity, transform';

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
      currentRef.style.willChange = 'auto';
    };
  }, [threshold, rootMargin, handleIntersect]);

  return { ref, isVisible };
};
