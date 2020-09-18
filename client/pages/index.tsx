//import Link from "next/link";
import React from "react";
// import styles from "./modules/index.module.scss";
import Link from "next/link";
import Navbar from "../components/Navbar/Navbar";

const IndexPage = () => {
  return (
    <div>
      <Navbar />
      <h1>Hello World</h1>
      <h2>Boilerplate</h2>
      <div>
        <Link href="/register">
          <a>Register</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;
