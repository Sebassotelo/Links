import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout from "../componentes/Layout";
import style from "../styles/Home.module.css";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

//Context
import { useContext, useEffect, useState } from "react";
import LinksContext from "../context/Context";

export default function Home() {
  const firestore = getFirestore();
  const context = useContext(LinksContext);
  const { setUsuario, setUser } = useContext(LinksContext);

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(context.auth, inspectorSesion);
    if (context.user) {
      buscarUsuario();
    }
  }, [context.user]);

  const inspectorSesion = (usuarioFirebase) => {
    //en caso de que haya seison iniciada
    if (usuarioFirebase) {
      setUser(usuarioFirebase);
    } else {
      //en caso de que haya seison iniciada
      setUser(null);
    }
  };

  const buscarUsuario = async () => {
    const docRef = doc(firestore, `users/${context.user.email}`);
    const consulta = await getDoc(docRef);
    if (consulta.exists()) {
      const infoDocu = consulta.data();
      setUsuario(infoDocu);
      return infoDocu;
    }
  };

  return (
    <Layout>
      <div className={style.container}>
        <div className={style.title__container}>
          <div>
            <h1 className={style.title}>LINKS</h1>
            <p className={style.text}>Todos tus links, en uno solo</p>
          </div>

          <button
            className={style.google}
            onClick={() => signInWithPopup(context.auth, googleProvider)}
          >
            <FcGoogle className={style.google__logo} />
            Acceder con Google
          </button>
          <div className={style.ejemplo}>
            <a
              href="https://links-59dx.vercel.app/u/_Sebassotelo"
              target={"_blank"}
            >
              <p>Links de Sebas</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
