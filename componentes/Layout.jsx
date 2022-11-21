import React, { useContext } from "react";
import LinksContext from "../context/Context";
import Head from "next/head";
import Navbar from "./Navbar";
import style from "../styles/Layout.module.css";
function Layout({ children, title }) {
  const context = useContext(LinksContext);

  return (
    <div style={{ display: "grid" }}>
      <Head>
        <title>Links {title && `| ${title} `}</title>
        <meta name="descripcion" content="Generador de Links" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {context.user && <Navbar />}

      <div>{children}</div>
      <div className={style.footer}>
        <p>
          Hecho por{" "}
          <a
            href="https://www.sebassotelo.com.ar/"
            target={"_blank"}
            rel="noreferrer"
          >
            Sebas Sotelo
          </a>
        </p>
      </div>
    </div>
  );
}

export default Layout;
