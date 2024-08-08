import React, { createContext, useState, useContext } from 'react'; // Import necessary functions from React

const DraggingContext = createContext(); // Create context for dragging

export const DraggingProvider = ({ children }) => { 
  const [isDragging, setIsDragging] = useState(false); // State for dragging
  const [swipeDirection, setSwipeDirection] = useState(null); // State for swipe direction

  return (
    <DraggingContext.Provider value={{ isDragging, setIsDragging, swipeDirection, setSwipeDirection }}>
      {children}
    </DraggingContext.Provider>
  );
};

export const useDragging = () => useContext(DraggingContext); // Hook to use dragging context
