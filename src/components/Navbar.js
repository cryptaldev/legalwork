import React from 'react'
import Button from './Button'
import styles from './Navbar.module.scss'

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.container}>

                <Button
                    primary={this.props.selected == "publish"}
                    onClick={this.props.nextDisplay.bind(this, "publish")}
                >
                    Publish
                </Button>
                <Button
                    primary={this.props.selected == "search"}
                    onClick={this.props.nextDisplay.bind(this, "search")}
                >
                    Search
                </Button>

                <Button
                    primary={this.props.selected == "wallet"}
                    onClick={this.props.nextDisplay.bind(this, "wallet")}
                >
                    Wallet
                </Button>

            </div>
        )
    }
}

export default Navbar
