import { motion } from "framer-motion";
import classes from "./Fieldset.module.css";

type FieldsetProps = {
  children: React.ReactNode;
  variants: {
    hidden: { opacity: number; y: number };
    visible: { opacity: number; y: number };
  };
  legend: string;
};

export default function Fieldset({
  children,
  variants,
  legend,
}: FieldsetProps) {
  return (
    <motion.fieldset
      variants={variants}
      initial="hidden"
      animate="visible"
      className={`${classes.fieldset} ${classes.password}`}
    >
      <legend>{legend}</legend>
      {children}
    </motion.fieldset>
  );
}
