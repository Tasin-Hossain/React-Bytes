import { useContext } from "react";
import ThemeContext from "../components/context/ThemeContext";


export const useTheme = () => useContext(ThemeContext);