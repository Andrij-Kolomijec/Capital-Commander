import { motion } from "framer-motion";
// import classes from "./ExpensesSettings.module.css";

export default function ExpensesSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
      ExpensesSettings
    </motion.div>
  );
}
