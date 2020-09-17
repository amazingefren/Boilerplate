import React from "react";
import { useForm } from "react-hook-form";
import styles from "./ReigsterForm.module.scss";
import { useMutation } from "urql";

type UserRegister = {
  username: string;
  password: string;
};

const REGISTER_MUTATION = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user{
        id
        username
      }
    }
  }
`;

const ReigsterForm = () => {
  const [, apiRegister] = useMutation(REGISTER_MUTATION);
  const { register, handleSubmit, reset, errors } = useForm<UserRegister>();
  const onSubmit = async (data: UserRegister) => {
    console.log("data", data);
    await apiRegister(data);
    reset();
  };

  return (
    <div id={styles.registerFormContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.registerFormField}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            ref={register({ required: true })}
          />
          {errors.username && errors.username.type == "required" && (
            <div className={styles.registerFormError}>
              You Must Enter a Username
            </div>
          )}
        </div>
        <div className={styles.registerFormField}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            ref={register({ required: true })}
          />
          {errors.password && errors.password.type == "required" && (
            <div className={styles.registerFormError}>
              You Must Enter a Password
            </div>
          )}
        </div>
        <input type="submit" value="Submit" id={styles.registerFormSubmit} />
      </form>
    </div>
  );
};

export default ReigsterForm;
