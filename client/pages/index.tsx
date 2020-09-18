//import Link from "next/link";
import React from "react";
import styles from "./modules/index.module.scss";
import Link from "next/link";

const IndexPage = () => (
  <div id={styles.indexWrapper}>
    <h1>Hello World</h1>
    <h2>Boilerplate</h2>
    <Link href="/register">
      <a>Register</a>
    </Link>
    <Link href="/login">
      <a>Login</a>
    </Link>
  </div>
);

export default IndexPage;
