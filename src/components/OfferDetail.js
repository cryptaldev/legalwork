import React, { Component } from 'react'
import moment from 'moment'
import styles from './JobDetail.module.scss'
import Input from './Form/Input'
import Correct from './Correct'
import Incorrect from './Incorrect'
import Button from './Button'
import classnames from 'classnames'


export default class JobDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offer: "",
            price: 0,
            showPublishForm: true,
            solutionUrl: "",
            inProcess: false,
            solutionUrlValid: false,
            errors: {
                solutionUrl: null
            }
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
        data.price = raw.service[0].attributes.main.price
        return data
    }

    processPublishData(type, data) {
        return {
            "publisher": "",
            "metadata": {
                "main": {
                    "name": "Offer for OpenLegal",
                    "dateCreated": new Date().toISOString().substring(0, 19) + 'Z',
                    "author": process.env.REACT_APP_BRAND,
                    "license": "Apache 2.0",
                    "price": data.service[0].attributes.main.price,
                    "files": [
                        {
                            "index": 0,
                            "contentType": "application/file",
                            "checksum": "2bf9d229d110d1976cdf85e9f3256c7f",
                            "checksumType": "MD5",
                            "contentLength": "15357507",
                            "compression": "pdf",
                            "encoding": "UTF-8",
                            "url": "https://nourlyet.com"
                        }
                    ],

                    "type": "dataset"
                },
                "additionalInformation": {
                    "publishedBy": localStorage.getItem("address"),
                    "checksum": "",
                    "categories": [],
                    "offered": true,
                    "basePoster": data.service[0].attributes.additionalInformation.basePoster,
                    "posterAction": "ready to pay",
                    "baseDID": data.service[0].attributes.additionalInformation.baseDID,
                    "offerDID": data.service[0].attributes.additionalInformation.offerDID,
                    "tags": [
                        process.env.REACT_APP_BRAND
                    ],
                    "description": data.service[0].attributes.additionalInformation.description,
                    "copyrightHolder": process.env.REACT_APP_BRAND,
                    "workExample": "image path, id, label",
                    "links": [],
                    "inLanguage": "en"
                }
            }
        }
    }

    async publishToOcean(type, d = null) {

        this.setState({ inProcess: true, showPublishForm: false })
        let publishData = this.processPublishData(type, d);
        console.log(JSON.stringify(publishData));
        try {
            const url = `https://agent.oceanprotocol.com/api/general/publishddo`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(publishData)
            })
            const data = await response.json()

            if (response.status !== 200) {
                localStorage.removeItem("lastPublish")
                this.setState({
                    inProcess: false,
                })
                return
            } else {
                localStorage.setItem("lastPublish", true)
                this.setState({
                    inProcess: false,
                    did: data
                })
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    renderPublishSuccess() {
        return (
            <div>
                <Correct loadComplete={true} />
                <p>{`Your offer published successfully`}
                    <br />
                    <a
                        target="_blank"
                        href={`https://commons.oceanprotocol.com/asset/did:op:${this.state.did}`}
                    >View in Ocean Commons
                    </a></p>


                <div style={{ textAlign: "center" }}>
                    <Button
                        primary
                        onClick={this.startAgain.bind(this, false)}
                    >
                        Close
                </Button>
                </div>
            </div >
        )
    }

    checkIfSelf() {
        let myAddress = localStorage.getItem('address')
        if (myAddress == this.props.data.data.service[0].attributes.additionalInformation.basePoster) {
            return true
        }
    }


    startAgain(isRetry) {
        //update states
        this.setState({
            title: "",
            description: "",
            titleValid: false,
            descriptionValid: false,
            inProcess: false,
            did: null,
            showPublishForm: true
        })
    }

    renderPublishFailure() {
        return (
            <>
                <Incorrect />
                <p style={{ color: "#D06079" }}>Oops! some error occured while publishing</p>
                <Button
                    primary
                    onClick={this.startAgain.bind(this, true)}
                >
                    Try Again
                </Button>
            </>
        )
    }
    renderPublishInProgress() {
        return (
            <div>
                <Correct loadComplete={false} />
                <p>Publishing Your Offer to Ocean Protocol</p>
            </div>
        )
    }


    renderOffer(offer, data) {
        let _data = this.parseData(offer)
        let dateCreated = moment(_data.dateCreated)
        return (
            <>
                <div className={styles.offersContainer}>
                    <div className={styles.metacontainer}>
                        <div className={classnames(styles.metadata, styles.poster)}>{_data.price > 0 ? `${_data.price} OCEAN` : 'FREE'}</div>
                        <div className={classnames(styles.metadata, styles.date)}>{Math.round(moment.duration(moment().diff(dateCreated)).asHours())} hours ago</div>
                    </div>
                    <p className={styles.description}>{_data.description}</p>
                    <div className={styles.poster}>{_data.publishedBy}</div>

                    {this.checkIfOfferAccepted(offer) ? this.renderOfferAccepted() : (this.checkIfEligibleForOffer(offer) ? this.renderAcceptOffer(offer.id, data.id) : "")}

                </div>
                <hr />
            </>
        )

    }

    handleUserInput(e) {
        const { name, value } = e.target

        this.setState({ [name]: value }, () => {
            this.validateField(name, value)
            localStorage.setItem(name, value)
        })
    }
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.errors
        let {
            solutionUrlValid
        } = this.state

        switch (fieldName) {
            case 'solutionUrl':
                solutionUrlValid = this.isUrlValid(value)
                fieldValidationErrors.solutionUrlValid = solutionUrlValid
                    ? ''
                    : 'Homepage is not a valid url'
                break
            default:
                break
        }
        this.setState(
            {
                errors: fieldValidationErrors,
                solutionUrlValid

            },
            this.validateForm
        )
    }

    validateForm() {
        this.setState({
            formValid:
                this.state.solutionUrlValid
        })
    }

    isValidUrl(str) {
        var pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
            'i'
        ) // fragment locator
        return !!pattern.test(str)
    }
    renderSubmitSolution(offerId, did) {
        let { solutionUrl } = this.state
        return (
            <div style={{ textAlign: "center", paddingTop: 20 }}>
                <Input
                    type="text"
                    name="title"
                    label="Link to solution"
                    placeholder="https://mysolution.io/solution.pdf"
                    value={solutionUrl}
                    required
                    help="Submit your solution to this issue"
                    onChange={this.handleUserInput.bind(this)}
                />

                <Button
                    primary
                    disabled={false}
                    onClick={this.publishToOcean.bind(this, offerId, did)}
                >
                    Submit Solution
                    </Button>
            </div>
        )
    }

    renderOfferAccepted() {
        return (
            <div style={{ textAlign: "center", paddingTop: 20 }}>
                <h3>✔ Accepted</h3>
            </div>
        )
    }
    renderMainForm() {
        let { offer, accepted } = this.props.data
        let _data = this.parseData(offer)
        let dateCreated = moment(_data.dateCreated)
        let title = _data.title.length >= 46 ? `${_data.title.substring(0, 45)}...` : _data.title
        return (
            <>
                <h2> Offer Details</h2>
                <div className={styles.container}>
                    <div className={styles.title}> {title} </div>
                    <p className={styles.description}>{_data.description}</p>
                    <div className={styles.poster}>{_data.publishedBy}</div>
                    <div className={styles.textContainer}>
                        <div className={classnames(styles.metadata, styles.date)}>{Math.round(moment.duration(moment().diff(dateCreated)).asHours())} hours ago</div>
                        <div className={classnames(styles.metadata, styles.offerCount)}>{_data.price > 0 ? _data.price + ' OCEAN' : 'FREE'}</div>
                        <div className={classnames(styles.metadata, styles.offerCount)}>Accepted ✔</div>
                    </div>

                </div>
                {this.renderSubmitSolution(offer.id)}
            </>

        )
    }

    renderOfferForm(data) {
        let { offer, price } = this.state
        return (
            <>
                <div className={styles.offerContainer}>
                    <Input
                        type="textarea"
                        tag="textarea"
                        rows="10"
                        cols="50"
                        name="offer"
                        label="Your Offer"
                        placeholder="I can help you with your taxes. I have a proven history of filing tax returns for about 10 years. I will need following details from you - your salary slips, other expenses, other incomes"
                        value={offer}
                        required
                        help="Describe in details how you intend to provide help and your price"
                        onChange={this.handleUserInput.bind(this)}
                    />
                    <Input
                        type="text"
                        name="price"
                        label="Your Service Price"
                        placeholder="100"
                        value={price}
                        required
                        help="How much will you charge for this?"
                        onChange={this.handleUserInput.bind(this)}
                    />
                </div>

                <div style={{ textAlign: "center" }}>
                    <Button
                        primary
                        disabled={false}
                        onClick={this.publishToOcean.bind(this, "offer", data)}
                    >
                        Post Offer
                    </Button>
                </div>
            </>
        )
    }
    render() {

        return (
            <>

                {
                    this.state.showPublishForm ?
                        this.renderMainForm() :
                        (
                            //is publish in progress
                            this.state.inProcess ?
                                this.renderPublishInProgress() :
                                (
                                    //is asset published
                                    this.state.did ?
                                        // show success
                                        this.renderPublishSuccess() :
                                        //show error
                                        this.renderPublishFailure()
                                )

                        )
                }
            </>
        )
    }
}



