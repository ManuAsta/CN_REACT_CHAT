import React from 'react'
//styles
import styles from "./AnimatedSide.module.scss";


export default function AnimatedSide() {
  return (
    <div className={`${styles.container} d-flex flex-column justify-content-center align-items-center`}>
        <h1>M-Chat</h1>
        <h5>Stay Connected</h5>
    </div>
  )
}
