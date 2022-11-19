import React, { useEffect, useState } from "react";
import style from "../../styles/Publico.module.css";
import { useRouter } from "next/router";
import Layout from "../../componentes/Layout";
import { useContext } from "react";
import LinksContext from "../../context/Context";

import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import Perfil from "../../componentes/Perfil";
import Loader from "../../componentes/Loader";
import Link from "next/link";

function User() {
  const firestore = getFirestore();
  const context = useContext(LinksContext);
  const { setInfoPublica } = useContext(LinksContext);
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [existe, setExiste] = useState(false);

  useEffect(() => {
    if (router.query.user) {
      llamada();
    }
  }, [router.query.user]);

  let busqueda;

  const llamada = async () => {
    const user = router.query.user;
    const docRef = collection(firestore, `users`);

    const q = query(docRef, where("username", "==", user));
    const comoQuieras = await getDocs(q);
    comoQuieras.forEach((doc) => setInfoPublica(doc.data()));

    comoQuieras.forEach((doc) => (busqueda = doc.data()));
    if (busqueda) {
      setExiste(true);
      setLoader(true);
    } else {
      setExiste(false);
      setLoader(true);
    }

    setLoader(true);
  };

  return (
    <Layout>
      {loader ? (
        <div className={style.fondo}>
          {existe ? (
            <div className={style.container}>
              <Perfil />

              <div className={style.links__container}>
                {context.infoPublica &&
                  context.infoPublica.links.map((item) => (
                    <div className={style.item__link}>
                      {" "}
                      <a
                        href={item.url}
                        className={style.item__a}
                        target={"_blank"}
                      >
                        {" "}
                        <p>{item.title}</p>{" "}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                alignSelf: "center",
                display: "grid",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              <h3>Este usuario no existe</h3>
              <Link href={"/"} className={style.volver__home}>
                Volver a Home
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
}

export default User;
