import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function CustomCursor() {
  const { theme } = useApp();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch capability dynamically
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Start as hidden until mouse moves
    cursor.style.opacity = '0';
    dot.style.opacity = '0';

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    const handleTouchStart = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
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
      
      const cNode = cursorRef.current;
      const dNode = dotRef.current;
      if (!cNode || !dNode) return;

      if (isClickable) {
        cNode.classList.remove('w-6', 'h-6');
        cNode.classList.add('w-10', 'h-10', 'border-primary');
        dNode.classList.add('scale-0');
      } else {
        cNode.classList.remove('w-10', 'h-10', 'border-primary');
        cNode.classList.add('w-6', 'h-6');
        dNode.classList.remove('scale-0');
      }
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
    window.addEventListener('touchstart', handleTouchStart);

    let animationFrameId: number;
    const render = () => {
      // Linear interpolation to make the outer ring drag/trail smoothly
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
      window.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Trailing Outer Ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border transition-all duration-150 ease-out -translate-x-1/2 -translate-y-1/2 w-6 h-6 ${
          theme === 'dark' 
            ? 'border-white/80 bg-white/5' 
            : 'border-black/80 bg-black/5'
        }`}
        style={{
          willChange: 'transform',
          transitionProperty: 'width, height, background-color, border-color, opacity',
        }}
      />
      {/* Sharp Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 scale-100"
        style={{
          willChange: 'transform',
          transitionProperty: 'transform, opacity',
        }}
      />
    </>
  );
}
