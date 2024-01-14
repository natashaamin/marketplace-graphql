import React, { useState } from "react";
import { useTranslation as t } from "@/hooks/useTranslation";

import logo from "@/assets/logo.png";

import styles from './index.less';
import { history } from "@umijs/max";

const Navbar = () => {
  const onClickLogin = () => {
    history.push('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className="logo-container">
        <img src={logo} alt="logo" className={styles.logo} />
      </div>
      <ul className={styles.menu}>
        <li className={styles.menuItem} onClick={onClickLogin}>
          {t('login')}
        </li>
      </ul>
  
    </nav>
  );
};

export default Navbar;
