import React from 'react'
import styles from './Form.module.scss'

const Form = ({ title, description, children, ...props }) => (
    <form className={styles.form} {...props}>
        <header className={styles.formHeader}>
            <h1 className={styles.formTitle}>{title}</h1>
            <p className={styles.formDescription}>{description}</p>
        </header>

        {children}
    </form>
)

export default Form
