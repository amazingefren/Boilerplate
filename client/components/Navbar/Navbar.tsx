import React, { Component } from "react";
import { useMeQuery } from "../../generated/graphql";
import styles from "./Navbar.module.scss";
// import { useUserQuery } from "../../generated/graphql";
import Link from "next/link";

const Navbar = () => {
  const [{ data, fetching }] = useMeQuery();
  let userBody = null;
  if (fetching) {
    userBody = null;
  } else if (data?.me) {
    userBody = (
      <>
        <h3>{data?.me?.username}</h3>
        <a>Logout</a>
      </>
    );
  } else
    userBody = (
      <>
        <Link href="/register">
          <a>Register</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </>
    );
  return (
    <div id={styles.navbarContainer}>
      <h1>Boiler</h1>
      {userBody}
    </div>
  );
};

export default Navbar;
