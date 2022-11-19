import React, { useContext, useState } from "react";
import style from "../styles/Navbar.module.css";
import Link from "next/link";
import LinksContext from "../context/Context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { AiOutlineMenu } from "react-icons/ai";

function Navbar() {
  const context = useContext(LinksContext);

  const [showNav, setShowNav] = useState(false);

  return (
    <div className={style.container}>
      <div className={style.nav}>
        <div className={style.nav__container}>
          <Link href={"/"}>
            <p className={style.link}>Home</p>
          </Link>
          {context.usuario && (
            <Link
              href={
                context.usuario.username && `/u/${context.usuario.username}`
              }
            >
              <p className={style.link}>Mis Links</p>
            </Link>
          )}
          <Link href={"/account"}>
            <p className={style.link}>Cuenta</p>
          </Link>
          <Link href={"/account/configuracion"}>
            <p className={style.link}>Configuracion</p>
          </Link>
        </div>
        <div className={style.google}>
          {context.user ? (
            <p
              className={style.cerrar__sesion}
              onClick={() => signOut(context.auth)}
            >
              Cerrar Sesion
            </p>
          ) : (
            <button
              onClick={() => signInWithPopup(context.auth, googleProvider)}
            >
              Acceder con Google
            </button>
          )}
        </div>
      </div>

      <div
        className={style.nav__mobile}
        style={showNav ? { top: "0px" } : { top: "-700px" }}
      >
        <div className={style.nav__container__mobile}>
          <Link href={"/"}>
            <p className={style.link__mobile}>Home</p>
          </Link>
          {context.usuario && (
            <Link
              href={
                context.usuario.username && `/u/${context.usuario.username}`
              }
            >
              <p className={style.link__mobile}>Mis Links</p>
            </Link>
          )}
          <Link href={"/account"}>
            <p className={style.link__mobile}>Cuenta</p>
          </Link>
          <Link href={"/account/configuracion"}>
            <p className={style.link__mobile}>Configuracion</p>
          </Link>
        </div>
        <div className={style.google}>
          {context.user ? (
            <p
              className={style.cerrar__sesion__mobile}
              onClick={() => signOut(context.auth)}
            >
              Cerrar Sesion
            </p>
          ) : (
            <button
              onClick={() => signInWithPopup(context.auth, googleProvider)}
            >
              Acceder con Google
            </button>
          )}
        </div>
      </div>
      <div className={style.mostrar__nav}>
        <AiOutlineMenu
          className={style.mostrar__nav__icon}
          onClick={() => setShowNav(true)}
        />
      </div>
    </div>
  );
}

export default Navbar;
