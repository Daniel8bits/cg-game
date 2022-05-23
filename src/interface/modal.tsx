import React from "react";
import styles from './style.css';

const Modal = ({active,children}) => {


    return (
        <div className={styles.modalContainer} style={{display:active ? 'block' : 'none'}}>
            <div className={styles.modalContent}>
                {children}
            </div>
        </div>
    )
}

export default Modal;