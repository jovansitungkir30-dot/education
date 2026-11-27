import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { hasWebGL, isLowPower } from './device';

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Canvas with a WebGL fallback and an error boundary. Rendering pauses while the scene is off screen.
 */
export default function Stage({ children, fallback, label, ...props }: CanvasProps & { fallback: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [low] = useState(isLowPower);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0" role="group" aria-label={label}>
      {hasWebGL() ? (
        <Boundary fallback={fallback}>
          <Canvas
            dpr={low ? [1, 1.25] : [1, 1.75]}
            shadows={low ? false : 'percentage'}
            frameloop={visible ? 'always' : 'never'}
            gl={{ antialias: !low, powerPreference: 'high-performance' }}
            fallback={fallback}
            {...props}
          >
            {children}
          </Canvas>
        </Boundary>
      ) : (
        fallback
      )}
    </div>
  );
}
