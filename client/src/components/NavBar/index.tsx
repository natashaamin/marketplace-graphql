import React, { useEffect, useState } from "react";
import { useTranslation as t } from "@/hooks/useTranslation";

import logo from "@/assets/logo.png";

import styles from './index.less';
import { history } from "@umijs/max";
import { useAccount } from "graz";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { data: account, isConnected } = useAccount();
  const { authToken, logout } = useAuth();

  const onClickLogin = () => {
    history.push('/login')
    logout()

  }

  // useEffect(() => {
  //   if(authToken !== null || isConnected) {
  //     history.push('/dashboard')
  //   }
  // }, [authToken, isConnected])


  return (
    <nav className={styles.navbar}>
      <div className="logo-container">
        <img src={logo} alt="logo" className={styles.logo} />
      </div>
      <ul className={styles.menu}>
        <li className={styles.menuItem} onClick={onClickLogin}>
          {(authToken === null && !isConnected) ? t('login') : t('logout')}
        </li>
      </ul>
  
    </nav>
  );
};

export default Navbar;
