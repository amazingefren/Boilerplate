import React from "react";
import { useForm } from "react-hook-form";

type UserRegister = {
  username: string;
  password: string;
};

const ReigsterForm = () => {
  const { register, handleSubmit, reset, errors } = useForm<UserRegister>();
  const onSubmit = (data: UserRegister) => {
    console.log("data", data);
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="registerField">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            ref={register({ required: true })}
          />
          {errors.username && errors.username.type == "required" && (
            <div className="registerFormError">You Must Enter a Username</div>
          )}
        </div>
        <div className="registerField">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            ref={register({ required: true })}
          />
          {errors.password && errors.password.type == "required" && (
            <div className="registerFormError">You Must Enter a Password</div>
          )}
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default ReigsterForm;
