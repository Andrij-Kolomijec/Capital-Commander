// import classes from "./Account.module.css";
import PasswordChange from "./PasswordChange";
import Fieldset from "./Fieldset";
import DeleteAccount from "./DeleteAccount";

export default function Account() {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <>
      <Fieldset variants={variants} legend="Change password">
        <PasswordChange />
      </Fieldset>
      <Fieldset variants={variants} legend="Delete account">
        <DeleteAccount />
      </Fieldset>
    </>
  );
}
