import { createContext, useContext, useState } from "react";
import Loader from "../components/loader/loader";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && (
        <div id="global-loader">
          {" "}
          <Loader />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
