import React from 'react'
import styles from './Label.module.scss'

const Label = ({ required, children, ...props }) => (
    <label
        className={required ? styles.required : styles.label}
        title={required ? 'Required' : ''}
        {...props}
    >
        {children}
    </label>
)

export default Label
