import React, { useState, useEffect, useContext } from "react";
import style from "../../styles/Apariencia.module.css";
import Layout from "../../componentes/Layout";
import LinksContext from "../../context/Context";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
} from "firebase/storage";
import Loader from "../../componentes/Loader";

function diseño() {
  const context = useContext(LinksContext);
  const { setUser, setUsuario } = useContext(LinksContext);
  const firestore = getFirestore();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loader, setLoader] = useState(false);

  const guardarPerfil = () => {
    const docRef = doc(firestore, `users/${context.user.email}`);

    const newPerfil = {
      title: `${title}`,
      desc: desc,
    };

    updateDoc(docRef, { perfil: newPerfil, username: title });
  };

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
      push("/");
      //en caso de que haya seison iniciada
    }
  };

  const buscarUsuario = async () => {
    const docRef = doc(firestore, `users/${context.user.email}`);
    const consulta = await getDoc(docRef);
    if (consulta.exists()) {
      const infoDocu = consulta.data();
      setTitle(infoDocu.perfil.title);
      setDesc(infoDocu.perfil.desc);
      setUsuario(infoDocu);
      setLoader(true);
      return infoDocu;
    }
  };

  return (
    <Layout>
      {" "}
      {loader ? (
        <div className={style.container}>
          <div className={style.perfil}>
            {" "}
            <div className={style.img__container}>
              {" "}
              <div className={style.img}></div>
              <div className={style.img__loader}>
                <button className={style.button}>Subir Imagen</button>
                <button className={style.button}>Eliminar Imagen</button>
              </div>
            </div>
            <div className={style.title__container}>
              <div className={style.title}>
                <p>Titulo del perfil</p>
                <div className={style.arroba}>
                  {" "}
                  <p>@</p>
                  <input
                    type="text"
                    className={style.title__input}
                    onChange={(e) => setTitle(e.target.value)}
                    defaultValue={`${context.usuario.perfil.title}`}
                  />
                </div>
              </div>
              <div className={style.title}>
                <p>Descripcion</p>
                <input
                  type="text"
                  className={style.desc__input}
                  onChange={(e) => setDesc(e.target.value)}
                  defaultValue={context.usuario.perfil.desc}
                />
                {console.log(desc, title)}
              </div>
              <button onClick={guardarPerfil} className={style.button}>
                Guardar
              </button>
            </div>
          </div>
          <h3>Temas</h3>
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
}

export default diseño;
