import React, { useContext } from "react";
import style from "../styles/Perfil.module.css";
import LinksContext from "../context/Context";

function Perfil() {
  const context = useContext(LinksContext);

  const imgFondo = {
    backgroundImage: `url(${context.infoPublica.img})`,
    backgroundSize: "cover",
  };

  return (
    <div className={style.container}>
      {" "}
      <div className={style.img} style={imgFondo}></div>
      <div className={style.p}>
        <p>@{context.infoPublica.perfil.title}</p>
        <p>{context.infoPublica.perfil.desc}</p>
      </div>
    </div>
  );
}

export default Perfil;
