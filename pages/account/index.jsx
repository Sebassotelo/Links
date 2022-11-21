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
  increment,
} from "firebase/firestore";
import { FaGripVertical } from "react-icons/fa";

import LinksContext from "../../context/Context";
import Perfil from "../../componentes/Perfil";
import Loader from "../../componentes/Loader";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  let docRef;

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
      docRef = doc(firestore, `users/${context.user.email}`);
    } else {
      push("/");
      //en caso de que haya seison iniciada
    }
  };

  const buscarOCrearUsuario = async () => {
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
    const consulta = await getDoc(docRef);
    const infoDocu = consulta.data();

    const newLinks = infoDocu.links.filter((item) => item.id !== e);

    setLinks(newLinks);
    updateDoc(docRef, { links: newLinks });
  };

  const reordenarArray = (result) => {
    if (!result.destination) return;
    if (result.destination === result.source) return;
    const newArray = links;
    const [reorder] = newArray.splice(result.source.index, 1);
    newArray.splice(result.destination.index, 0, reorder);
    setLinks(newArray);
    updateDoc(docRef, { links: newArray });
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
              <DragDropContext onDragEnd={reordenarArray}>
                <Droppable droppableId="lista">
                  {(provider) => (
                    <div
                      {...provider.droppableProps}
                      ref={provider.innerRef}
                      className={style.container__links__publicos}
                    >
                      {context.usuario.links &&
                        links.map((item, i) => {
                          return (
                            <>
                              <Draggable
                                key={item.id.toString()}
                                draggableId={item.id.toString()}
                                index={i}
                              >
                                {(provider) => (
                                  <div
                                    ref={provider.innerRef}
                                    {...provider.draggableProps}
                                    className={style.item__link}
                                  >
                                    <div
                                      className={style.move__icon}
                                      {...provider.dragHandleProps}
                                    >
                                      <FaGripVertical />
                                    </div>

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
                                )}
                              </Draggable>
                            </>
                          );
                        })}
                      {provider.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
