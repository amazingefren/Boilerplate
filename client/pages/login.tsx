import React from "react";
import styles from "./modules/register.module.scss";
import LoginForm from "../components/Login/LoginForm";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  return (
    <div id={styles.registerContainer}>
      <LoginForm />
    </div>
  );
};

export default Login;
