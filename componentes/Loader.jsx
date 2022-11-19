import React from "react";
import style from "../styles/Loader.module.css";
function Loader() {
  return (
    <div className={style.fondo}>
      <div class={style.lds__ripple}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
