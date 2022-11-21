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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
