import React from 'react';
//styles
import styles from "./Sign.module.scss";
//components
import AnimatedSide from '../../components/AnimatedSide/AnimatedSide';
import { Outlet } from 'react-router-dom';

export default function Sign() {
  return (
    <div className={` ${styles.layout} `}>
            <div className={`${styles.animated}`}>
                <AnimatedSide/>
            </div>
            <div className={`${styles.form}`}>
               <Outlet/>
            </div>
    </div>
  )
}
