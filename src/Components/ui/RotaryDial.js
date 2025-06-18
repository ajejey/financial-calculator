"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'; // Import useCallback

const RotaryDial = ({ value, onChange, min = 0, max = 100, step = 1 }) => {
  const dialRef = useRef(null);
  const [angle, setAngle] = useState(0);

  const getAngleFromValue = useCallback((val) => { // Wrap with useCallback
    const percentage = ((val - min) / (max - min)) * 100;
    return (percentage / 100) * 360; // Full circle for 100%
  }, [min, max]); // Add min and max as dependencies

  const getValueFromAngle = useCallback((ang) => { // Also wrap getValueFromAngle as it's used in handleInteraction
    const percentage = (ang % 360) / 360;
    let val = percentage * (max - min) + min;
    val = Math.round(val / step) * step; // Snap to step
    return Math.max(min, Math.min(max, val));
  }, [min, max, step]); // Add min, max, step as dependencies

  useEffect(() => {
    setAngle(getAngleFromValue(value));
  }, [value, getAngleFromValue]); // useEffect now depends on memoized getAngleFromValue and value

  const handleInteraction = useCallback((event) => { // Wrap handleInteraction
    if (!dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;
    if (event.touches) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    newAngle = (newAngle + 360 + 90) % 360; // Offset by 90 degrees to start from top

    const newValue = getValueFromAngle(newAngle);
    if (onChange) {
      onChange(newValue);
    }
  }, [getValueFromAngle, onChange]); // Add getValueFromAngle and onChange as dependencies

  const handleMouseMove = useCallback((e) => { // Memoize handleMouseMove
    handleInteraction(e);
  }, [handleInteraction]);

  const handleMouseUp = useCallback(() => { // Memoize handleMouseUp
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]); // Dependency on handleMouseMove

  const handleMouseDown = useCallback((e) => { // Memoize handleMouseDown
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]); // Dependencies on handleMouseMove and handleMouseUp

  const handleTouchMove = useCallback((e) => { // Memoize handleTouchMove
    e.preventDefault(); // Prevent scrolling while dragging
    handleInteraction(e);
  }, [handleInteraction]);

  const handleTouchEnd = useCallback(() => { // Memoize handleTouchEnd
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]); // Dependency on handleTouchMove

  const handleTouchStart = useCallback((e) => { // Memoize handleTouchStart
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, handleTouchEnd]); // Dependencies on handleTouchMove and handleTouchEnd


  return (
    <div
      ref={dialRef}
      className="relative w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-400 flex items-center justify-center select-none cursor-pointer"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ touchAction: 'none' }} // Prevents default touch actions like scrolling
    >
      <div
        className="absolute w-4 h-4 bg-red-500 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg) translateY(-14px) `, // Adjust 14px to be on the edge of a 32px dial (16 - half handle)
          transformOrigin: '50% 16px', // Center of the dial (half of w-32)
         }}
      ></div>
      <div className="text-xl font-bold text-gray-700">
        {value}
      </div>
    </div>
  );
};

export default RotaryDial;
