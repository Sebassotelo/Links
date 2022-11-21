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

function Configuracion() {
  const context = useContext(LinksContext);
  const { setUser, setUsuario, setInfoPublica } = useContext(LinksContext);
  const firestore = getFirestore();
  const storage = getStorage();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loader, setLoader] = useState(false);
  const [carga, setCarga] = useState(true);
  const [url, setUrl] = useState("");

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

  const guardarPerfil = () => {
    const docRef = doc(firestore, `users/${context.user.email}`);

    const newPerfil = {
      title: `${title}`,
      desc: desc,
    };

    updateDoc(docRef, { perfil: newPerfil, username: title, img: url });
  };

  const fileHandler = async (e) => {
    setCarga(null);
    //detectar el archivo
    const archivoLocal = e.target.files[0];
    //cargarlo a firebase storage
    const archivoRef = ref(storage, `documentos/${archivoLocal.name}`);
    await uploadBytes(archivoRef, archivoLocal);
    //obtener URL
    const urlImg = await getDownloadURL(archivoRef);
    setUrl(urlImg);
    setCarga(true);
  };

  const buscarUsuario = async () => {
    const docRef = doc(firestore, `users/${context.user.email}`);
    const consulta = await getDoc(docRef);
    if (consulta.exists()) {
      const infoDocu = consulta.data();
      setTitle(infoDocu.perfil.title);
      setDesc(infoDocu.perfil.desc);
      setUrl(infoDocu.img);
      setUsuario(infoDocu);
      setInfoPublica(infoDocu);
      setLoader(true);
      return infoDocu;
    }
  };

  const eliminarImg = () => {
    const docRef = doc(firestore, `users/${context.user.email}`);
    updateDoc(docRef, { img: "" });
  };

  const imgFondo = {
    backgroundImage: `url(${context.infoPublica.img})`,
    backgroundSize: "cover",
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
              <div className={style.img} style={imgFondo}></div>
              <div className={style.img__loader}>
                <input type="file" onChange={fileHandler} />
                <button className={style.button} onClick={eliminarImg}>
                  Eliminar Imagen
                </button>
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

              {carga && (
                <button onClick={guardarPerfil} className={style.button}>
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </Layout>
  );
}

export default Configuracion;
