import React from "react";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.scss";
import { useLoginMutation } from "../../generated/graphql";
import { useRouter } from "next/router";

type UserLogin = {
  username: string;
  password: string;
  success: boolean;
};

const LoginForm = () => {
  const [, apiLogin] = useLoginMutation(); // TO BE CREATED
  const { register, handleSubmit, reset, errors, setError } = useForm<
    UserLogin
  >();
  const router = useRouter();

  const onSubmit = async (data: UserLogin) => {
    // console.log("data", data);
    const res = await apiLogin(data);
    if (res.data?.login.errors) {
      console.log(res.data.login.errors[0]);
      const {
        field: errorType,
        message: errorMessage,
      } = res.data.login.errors[0];
      console.log(errorMessage);
      if (errorType == "username" || errorType == "password")
        setError(errorType, { message: errorMessage });
      else {
        setError("username", { message: "something went wrong" });
        console.log(errorType, errorMessage);
      }
    } else {
      console.log(res.data?.login.user?.id);
      setError("success", { message: "Success" });
      setTimeout(() => reset(), 500);
      setTimeout(() => router.push("/"), 500);
    }
  };

  return (
    <div id={styles.loginFormContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.loginFormField}>
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
            <div className={styles.loginFormError}>
              {errors.username.message}
            </div>
          )}
        </div>
        <div className={styles.loginFormField}>
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
            <div className={styles.loginFormError}>
              {errors.password.message}
            </div>
          )}
        </div>
        <input
          name="submit"
          type="submit"
          value="Submit"
          id={styles.loginFormSubmit}
          ref={register({})}
        />
        {errors.success && <div>{errors.success.message}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
