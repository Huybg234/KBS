import { useState, createContext } from "react";
const DataContext = createContext();
export default DataContext;

export const DataProvider = ({ children }) => {
  const [movies, setMovies] = useState(null);
  const contextData = {
    movies,
    setMovies,
  };
  return (
    <DataContext.Provider value={contextData}>{children}</DataContext.Provider>
  );
};
