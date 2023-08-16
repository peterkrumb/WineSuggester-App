import React from "react";
import styles from "../App.module.css";
import GlassWineBlack from "../assets/GlassWineBlack.jpeg";

const Header = () => {
  return (
    <div className={styles.header}>
      <img src={GlassWineBlack} alt="" className={styles.headerIcon} />
    </div>
  );
};

export default Header;
