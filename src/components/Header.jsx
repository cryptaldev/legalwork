import React, { PureComponent } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Button from './Button'
import { ReactComponent as Logo } from '../assets/legal.svg'
import styles from './Header.module.scss'

export default class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Router>
                <header className={styles.appHeader}>
                    <Logo />
                    <div className={styles.container}>
                        <p className={styles.title}>LegalWork</p>
                        <p className={styles.subtitle}>Decentralised Legal Job Market</p>
                    </div>

                    <div className={styles.container}>
                        <Link to="/jobs">
                            <Button
                                link
                                className={styles.topLinks}
                                onClick={this.props.nextDisplay.bind(this, "jobs")}
                            >
                                All Jobs
                            </Button>
                        </Link>
                        <Link to="/publish">
                            <Button
                                link
                                className={styles.topLinks}
                                onClick={this.props.nextDisplay.bind(this, "publish")}
                            >
                                Post Job
                            </Button>
                        </Link>

                        <Link to="/myjobs">
                            <Button
                                link
                                className={styles.topLinks}
                                onClick={this.props.nextDisplay.bind(this, "myjobs")}
                            >
                                My Posts
                        </Button>
                        </Link>
                        <Link to="/offers">
                            <Button
                                link
                                className={styles.topLinks}
                                onClick={this.props.nextDisplay.bind(this, "myoffers")}
                            >
                                My Offers
                        </Button>
                        </Link>

                    </div>
                </header >
            </Router >

        )
    }
}
