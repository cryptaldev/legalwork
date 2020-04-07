import React, { Component } from 'react'
import './styles/global.scss'
import PublishForm from './components/PublishForm'
import Search from './components/Search'
import Jobs from './components/Jobs'
import Offers from './components/Offers'
import Header from './components/Header'
import styles from './App.module.scss'
import JobDetail from './components/JobDetail'
import OfferDetail from './components/OfferDetail'
import { RouteContext } from './components/context'
import Footer from './components/Footer'
console.log(process.env.REACT_APP_BRAND)

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { nextToDisplay: '', jobData: null }
    }

    chooseDisplay(nextToDisplay) {
        console.log(`CHOOSE - ` + nextToDisplay)
        switch (nextToDisplay) {
            case 'publish':
                return <PublishForm />
            case 'search':
                return <Search />
            case 'myjobs':
                return <Jobs myAssets />
            case 'job':
                return <JobDetail data={this.state.jobData} />
            case 'myoffers':
                return <Offers />
            case 'offer':
                return <OfferDetail data={this.state.jobData} />
            case 'home':
                return <Home />
            default:
                return <Home />
        }
    }

    setNextDisplay(nextDisplay, args = null) {
        console.log(`NXT - ` + nextDisplay)
        switch (nextDisplay) {
            case 'publish':
                if (this.state.nextToDisplay != 'publish') {
                    this.setState({ nextToDisplay: 'publish' })
                }
                break;
            case 'jobs':
                if (this.state.nextToDisplay != 'jobs') {
                    this.setState({ nextToDisplay: 'jobs' })
                }
                break;
            case 'myjobs':
                if (this.state.nextToDisplay != 'myjobs') {
                    this.setState({ nextToDisplay: 'myjobs' })
                }
                break;
            case 'myoffers':
                if (this.state.nextToDisplay != 'myoffers') {
                    this.setState({ nextToDisplay: 'myoffers' })
                }
                break;
            case 'home':
                if (this.state.nextToDisplay != 'home') {
                    this.setState({ nextToDisplay: 'home' })
                }
                break;
            case 'job':
                if (this.state.nextToDisplay != 'job') {
                    this.setState({ nextToDisplay: 'job', jobData: args })
                }
                break;
            case 'offer':
                if (this.state.nextToDisplay != 'offer') {
                    this.setState({ nextToDisplay: 'offer', jobData: args })
                }
                break;
            default:
                if (this.state.nextToDisplay != 'home') {
                    this.setState({ nextToDisplay: 'home' })
                }
                break;
        }
    }

    render() {
        return (
            <RouteContext.Provider value={{ nextToDisplay: this.setNextDisplay.bind(this) }}>
                <div className={styles.app}>

                    <Header selected={this.state.nextToDisplay} nextDisplay={this.setNextDisplay.bind(this)} />

                    <div className={styles.container}>
                        <div className={styles.content}>
                            {this.chooseDisplay(this.state.nextToDisplay)}
                        </div>
                    </div>
                    <Footer />
                </div>
            </RouteContext.Provider>
        )
    }
}

const Home = () => {
    return (
        <Jobs />
    )
}

export default App
