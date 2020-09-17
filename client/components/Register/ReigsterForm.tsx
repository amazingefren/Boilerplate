import React from "react";
import { useForm } from "react-hook-form";
import styles from "./ReigsterForm.module.scss";
import { useRegisterMutation } from "../../generated/graphql";

type UserRegister = {
  username: string;
  password: string;
};

const ReigsterForm = () => {
  const [, apiRegister] = useRegisterMutation();
  const { register, handleSubmit, reset, errors } = useForm<UserRegister>();

  const onSubmit = async (data: UserRegister) => {
    // console.log("data", data);
    const res = await apiRegister(data);
    if (res.data?.register.errors) {
      console.log(res.data.register.errors[0]);
    } else {
      console.log(res.data?.register.user?.id);
      reset();
    }
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
