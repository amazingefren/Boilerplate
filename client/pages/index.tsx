//import Link from "next/link";
import React from "react";
import styles from "./modules/index.module.scss";
import Link from "next/link";
import { useUserQuery } from "../generated/graphql";

const IndexPage = () => {
  const [{ data, fetching }] = useUserQuery();
  if (data) {
    console.log(data);
  }
  return (
    <div id={styles.indexWrapper}>
      <h1>Hello World</h1>
      <h2>Boilerplate</h2>
      {!data ? (
        <div>
          <Link href="/register">
            <a>Register</a>
          </Link>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </div>
      ) : (
        <div>Hello {data?.me?.username} </div>
      )}
    </div>
  );
};

export default IndexPage;
