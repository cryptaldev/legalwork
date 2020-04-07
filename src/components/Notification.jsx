import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './Notification.module.scss'

export default class Notification extends PureComponent {
    static propTypes = {
        displaySuccess: PropTypes.string,
        displayFailure: PropTypes.string,
        hideNotification: PropTypes.func
    }

    render() {
        const { displaySuccess, displayFailure } = this.props

        const showNotification =
            displaySuccess !== null || displayFailure !== null

        if (!showNotification) {
            return null
        }

        return (
            <aside
                className={
                    displaySuccess
                        ? styles.notificationSuccess
                        : styles.notification
                }
            >
                {displaySuccess || displayFailure}
                <button
                    className={styles.close}
                    onClick={this.props.hideNotification}
                    title="Dismiss Notification"
                >
                    &times;
                </button>
            </aside>
        )
    }
}
