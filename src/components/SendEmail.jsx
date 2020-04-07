import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import styles from './SendEmail.module.scss'

export default class Header extends PureComponent {
    static propTypes = {
        to: PropTypes.string.isRequired,
        subject: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }

    render() {
        const { to, subject, title } = this.props

        return (
            <div className={styles.emailLink}>
                <Button link href={`mailto:${to}?Subject=${subject}`}>
                    {title}
                </Button>
            </div>
        )
    }
}
