import React, { useContext, useState, useEffect, DragEvent } from "react";
import Layout from "../../componentes/Layout";
import { useRouter } from "next/router";
import style from "../../styles/Links.module.css";
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

import LinksContext from "../../context/Context";
import Perfil from "../../componentes/Perfil";
import Loader from "../../componentes/Loader";

function Index() {
  const { push } = useRouter();
  const firestore = getFirestore();
  const context = useContext(LinksContext);
  const { setUsuario, setUser, setInfoPublica } = useContext(LinksContext);

  const [showAgregar, setShowAgregar] = useState(false);
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);

  useEffect(() => {
    onAuthStateChanged(context.auth, inspectorSesion);

    if (context.user) {
      buscarOCrearUsuario();
    }
  }, [context.user]);

  const inspectorSesion = (usuarioFirebase) => {
    //en caso de que haya seison iniciada
    if (usuarioFirebase) {
      setUser(usuarioFirebase);
    } else {
      push("/");
      //en caso de que haya seison iniciada
    }
  };

  const buscarOCrearUsuario = async () => {
    const docRef = doc(firestore, `users/${context.user.email}`);
    const consulta = await getDoc(docRef);
    if (consulta.exists()) {
      const infoDocu = consulta.data();
      setUsuario(infoDocu);
      setInfoPublica(infoDocu);
      setLinks(infoDocu.links);
      setLoader(true);
      return infoDocu;
    } else {
      await setDoc(docRef, {
        links: [],
        perfil: { title: "" },
        fotoPerfil: "",
        styles: {},
        username: "",
        img: "",
      });
      const consulta = await getDoc(docRef);
      const infoDocu = consulta.data();
      setLoader(true);
      setUsuario(infoDocu);
      return infoDocu;
    }
  };

  const agregarLinks = async (e) => {
    e.preventDefault();

    const docRef = doc(firestore, `users/${context.user.email}`);
    const consulta = await getDoc(docRef);
    const infoDocu = consulta.data();

    const newLink = [
      ...infoDocu.links,
      { title: title, url: url, id: +new Date() },
    ];
    setLinks(newLink);
    updateDoc(docRef, { links: newLink });

    setTitle("");
    setUrl("");
  };

  const eliminarLink = async (e) => {
    const docRef = doc(firestore, `users/${context.user.email}`);
    const consulta = await getDoc(docRef);
    const infoDocu = consulta.data();

    const newLinks = infoDocu.links.filter((item) => item.id !== e);

    setLinks(newLinks);
    updateDoc(docRef, { links: newLinks });
  };

  return (
    <Layout title={"Account"}>
      {loader ? (
        <div className={style.fondo}>
          <div className={style.container}>
            <Perfil />
            <div className={style.links}>
              {showAgregar ? (
                <div className={style.link__add}>
                  <div className={style.link__contain}>
                    <p>Titulo</p>
                    <input
                      type="text"
                      placeholder="Titulo"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      id="title"
                    />
                  </div>
                  <div className={style.link__contain}>
                    <p>Link</p>
                    <input
                      type="text"
                      placeholder="Link"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      id="url"
                    />
                  </div>
                  <button onClick={agregarLinks}>Agregar Link</button>{" "}
                </div>
              ) : (
                <div className={style.agregar__container}>
                  <p
                    onClick={() => setShowAgregar(true)}
                    className={style.agregar__link}
                  >
                    Agregar Link
                  </p>
                </div>
              )}
              <div className={style.container__links__publicos}>
                {context.usuario.links &&
                  links.map((item, i) => (
                    <div className={style.item__link} key={i} draggable>
                      {" "}
                      <a
                        href={item.url}
                        className={style.item__a}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {" "}
                        <p>{item.title}</p>{" "}
                      </a>
                      <p
                        onClick={() => eliminarLink(item.id)}
                        className={style.item__delete}
                      >
                        Eliminar
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
}

export default Index;
