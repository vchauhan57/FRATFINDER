import React, { createContext, useState, useContext } from 'react';

const DraggingContext = createContext();

export const DraggingProvider = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  return (
    <DraggingContext.Provider value={{ isDragging, setIsDragging, swipeDirection, setSwipeDirection }}>
      {children}
    </DraggingContext.Provider>
  );
};

export const useDragging = () => useContext(DraggingContext);
