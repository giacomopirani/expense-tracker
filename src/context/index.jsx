import { createContext, useState } from "react";

export const MyContext = createContext();

const GlobalState = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

export default GlobalState;
