import React from "react";
import { useForm } from "react-hook-form";
import styles from "./ReigsterForm.module.scss";
import { useRegisterMutation } from "../../generated/graphql";

type UserRegister = {
  username: string;
  password: string;
  success: boolean;
};

const ReigsterForm = () => {
  const [, apiRegister] = useRegisterMutation();
  const { register, handleSubmit, reset, errors, setError } = useForm<
    UserRegister
  >();

  const onSubmit = async (data: UserRegister) => {
    // console.log("data", data);
    const res = await apiRegister(data);
    if (res.data?.register.errors) {
      console.log(res.data.register.errors[0]);
      const {
        field: errorType,
        message: errorMessage,
      } = res.data.register.errors[0];
      console.log(errorMessage);
      if (errorType == "username" || errorType == "password")
        setError(errorType, { message: errorMessage });
      else {
        setError("username", { message: "something went wrong" });
        console.log(errorType, errorMessage);
      }
    } else {
      console.log(res.data?.register.user?.id);
      setError("success", { message: "Success" });
      setTimeout(() => reset(), 1000);
    }
  };

  return (
    <div id={styles.registerFormContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.registerFormField}>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            ref={register({
              required: { value: true, message: "Username is Required" },
            })}
          />
          {errors.username && (
            <div className={styles.registerFormError}>
              {errors.username.message}
            </div>
          )}
        </div>
        <div className={styles.registerFormField}>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            ref={register({
              required: { value: true, message: "Password is Required" },
            })}
          />
          {errors.password && (
            <div className={styles.registerFormError}>
              {errors.password.message}
            </div>
          )}
        </div>
        <input
          name="submit"
          type="submit"
          value="Submit"
          id={styles.registerFormSubmit}
          ref={register({})}
        />
        {errors.success && <div>{errors.success.message}</div>}
      </form>
    </div>
  );
};

export default ReigsterForm;
