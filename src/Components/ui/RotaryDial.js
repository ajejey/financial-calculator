"use client"

import React, { useState, useRef, useEffect } from 'react';

const RotaryDial = ({ value, onChange, min = 0, max = 100, step = 1 }) => {
  const dialRef = useRef(null);
  const [angle, setAngle] = useState(0);

  const getAngleFromValue = (val) => {
    const percentage = ((val - min) / (max - min)) * 100;
    return (percentage / 100) * 360; // Full circle for 100%
  };

  const getValueFromAngle = (ang) => {
    const percentage = (ang % 360) / 360;
    let val = percentage * (max - min) + min;
    val = Math.round(val / step) * step; // Snap to step
    return Math.max(min, Math.min(max, val));
  };

  useEffect(() => {
    setAngle(getAngleFromValue(value));
  }, [value, min, max]);

  const handleInteraction = (event) => {
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
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    handleInteraction(e);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling while dragging
    handleInteraction(e);
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };


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
