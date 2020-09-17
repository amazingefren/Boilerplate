import React from "react";
import styles from "./modules/register.module.scss";
import RegisterForm from "../components/Register/ReigsterForm";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <div id={styles.registerContainer}>
      <RegisterForm />
    </div>
  );
};

export default Register;
