import React, { Component } from 'react'
import moment from 'moment'
import JobDetail from '../components/JobDetail'
import styles from './Asset.module.scss'
import { RouteContext } from './context'


export default class Asset extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    parseData(raw) {
        let data = raw.service[0].attributes.main
        if (raw.service[0].attributes.additionalInformation) {
            data.description = raw.service[0].attributes.additionalInformation.description

        }
        data.id = raw.id
        data.title = raw.service[0].attributes.main.name
        data.dateCreated = raw.service[0].attributes.main.dateCreated
        data.publishedBy = raw.service[0].attributes.additionalInformation.publishedBy
        return data
    }


    renderJob() {
        //console.log(this.props.data)
        let { data, offers } = this.props.data
        let _data = this.parseData(data)
        let dateCreated = moment(_data.dateCreated)
        let title = _data.title.length >= 100 ? `${_data.title.substring(0, 99)}...` : _data.title
        return (

            <RouteContext.Consumer>
                {(value) => {
                    //console.log(JSON.stringify(value))
                    return (<>
                        <div className={styles.container}>
                            <div className={styles.textContainer}>
                                <div className={styles.titleContainer} onClick={value.nextToDisplay.bind(this, "job", this.props.data)} >{title}</div>
                                <div className={styles.poster}>{offers.length} offers</div>
                                <div className={styles.metadata}>{Math.round(moment.duration(moment().diff(dateCreated)).asHours())} hours ago</div>
                                <br />
                            </div>
                        </div>
                        <hr />
                    </>)
                }}
            </RouteContext.Consumer>



        )
    }


    renderOffer() {
        console.log(this.props.data)
        let _data = this.parseData(this.props.data.offer)
        let dateCreated = moment(_data.dateCreated)
        let title = _data.title.length >= 48 ? `${_data.title.substring(0, 45)}...` : _data.title
        return (

            <RouteContext.Consumer>
                {(value) => {
                    //console.log(JSON.stringify(value))
                    return (<>
                        <div className={styles.container}>
                            <div className={styles.textContainer}>
                                <div className={styles.titleContainer} onClick={value.nextToDisplay.bind(this, "offer", this.props.data)} >{title}</div>
                                <div className={styles.poster}>Accepted ✔</div>
                                <div className={styles.metadata}>{Math.round(moment.duration(moment().diff(dateCreated)).asHours())} hours ago</div>
                                <br />
                            </div>
                        </div>
                        <hr />
                    </>)
                }}
            </RouteContext.Consumer>



        )
    }

    render() {
        return this.props.type == 'offer' ? this.renderOffer() : this.renderJob()
    }

}
