import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router";

const ExampleContext = createContext(null);

export const ExampleProvider = ({ children }) => {
  const location = useLocation();
  let lastLocation = useRef(null);

  useEffect(() => {
    lastLocation.current = location;
  }, [location]);

  return (
    <ExampleContext.Provider value={lastLocation.current}>
      {children}
    </ExampleContext.Provider>
  );
};

export const UsePreviousL = () => {
  return useContext(ExampleContext);
};
