import React, { useEffect } from "react";
import { useState } from "react";
import LinksContext from "./Context";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import firebaseApp from "../services/firebase/firebase";

function LinksProvider(props) {
  const [links, setLinks] = useState([]);
  const [infoPublica, setInfoPublica] = useState({});

  //Usuario son los datos de base de datos
  const [usuario, setUsuario] = useState(null);

  //User son los datos de Google
  const [user, setUser] = useState(null);

  const auth = getAuth(firebaseApp);

  useEffect(() => {}, []);

  return (
    <LinksContext.Provider
      value={{
        auth: auth,
        links: links,
        usuario: usuario,
        user: user,
        infoPublica: infoPublica,
        setLinks,
        setUsuario,
        setUser,
        setInfoPublica,
      }}
    >
      {props.children}
    </LinksContext.Provider>
  );
}

export default LinksProvider;
