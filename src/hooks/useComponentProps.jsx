import { useContext } from "react";
import { ComponentPropsContext } from "../components/context/ComponentPropsProvider";

export const useComponentProps = () => {
  const ctx = useContext(ComponentPropsContext);
  if (!ctx) throw new Error('useComponentProps must be used inside ComponentPropsProvider');
  return ctx;
};

export default useComponentProps;