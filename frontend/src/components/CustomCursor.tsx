import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const detectTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(hasTouch);
    };
    detectTouch();

    if (isTouch) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer') ||
        stylesHasCursorPointer(target);
      
      setHovered(!!isClickable);
    };

    const stylesHasCursorPointer = (el: HTMLElement): boolean => {
      try {
        const style = window.getComputedStyle(el);
        return style.cursor === 'pointer';
      } catch {
        return false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;
    const render = () => {
      // Linear interpolation to make the outer ring drag/trail smoothly behind mouse
      const ease = 0.15;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouch]);

  if (isTouch || hidden) return null;

  return (
    <>
      {/* Trailing Outer Ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-outline-variant/60 mix-blend-difference transition-all duration-150 ease-out -translate-x-1/2 -translate-y-1/2 ${
          hovered ? 'w-10 h-10 bg-white border-white' : 'w-6 h-6'
        }`}
        style={{
          willChange: 'transform',
        }}
      />
      {/* Sharp Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-primary mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
          hovered ? 'scale-0' : 'scale-100'
        }`}
        style={{
          willChange: 'transform',
        }}
      />
    </>
  );
}
