import React from 'react'
import PropTypes from 'prop-types'
import styles from './FormErrors.module.scss'

export const FormErrors = ({ formErrors }) => {
    return (<div className={styles.formErrors}>
        {Object.keys(formErrors).map(
            (fieldName, i) =>
                formErrors[fieldName].length > 0 && (
                    <p key={i}>
                        {fieldName} {formErrors[fieldName]}
                    </p>
                )
        )}
    </div>)
}


FormErrors.propTypes = {
    formErrors: PropTypes.object
}
