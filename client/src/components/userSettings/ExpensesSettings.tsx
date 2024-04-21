// import classes from "./ExpensesSettings.module.css";
import BaseCurrency from "./BaseCurrency";
import Fieldset from "./Fieldset";

export default function ExpensesSettings() {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Fieldset variants={variants} legend="Change base currency">
      <BaseCurrency />
    </Fieldset>
  );
}
