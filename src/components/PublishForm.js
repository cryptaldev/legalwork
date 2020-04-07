import React, { Component } from 'react'
import * as ethereumAddress from 'ethereum-address'
import { FormErrors } from './FormErrors'
import Button from './Button'
import Form from './Form/Form'
import Input from './Form/Input'
import Correct from './Correct'
import Incorrect from './Incorrect'

export default class PublishForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: localStorage.getItem('title'),
            description: localStorage.getItem('description'),
            dataurl: localStorage.getItem('dataurl'),
            author: localStorage.getItem('author'),
            address: localStorage.getItem('address'),
            copyright: localStorage.getItem('copyright'),
            errors: {
                title: '',
                description: '',
                dataurl: '',
                author: '',
                address: '',
                copyright: '',
            },
            titleValid: false,
            descriptionValid: false,
            dataurlValid: false,
            authorValid: false,
            addressValid: false,
            formValid: true,
            copyrightValid: false,
            inProcess: false,
            did: null,
            showPublishForm: true
        }
    }

    componentDidMount() {
        let lastPublish = localStorage.getItem("lastPublish")
        if (lastPublish && lastPublish.length) {
            this.clearLocalStorage();
            this.setState({
                title: "",
                description: "",
                dataurl: "",
                author: "",
                copyright: "",
            })
        }
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
            titleValid,
            descriptionValid
        } = this.state

        switch (fieldName) {
            case 'title':
                titleValid = value.length >= 5
                fieldValidationErrors.title = titleValid ? '' : ' is too short'
                break
            case 'description':
                descriptionValid = value.length >= 6
                fieldValidationErrors.description = descriptionValid
                    ? ''
                    : ' is too short'
                break
            default:
                break
        }
        this.setState(
            {
                errors: fieldValidationErrors,
                titleValid,
                descriptionValid
            },
            this.validateForm
        )
    }

    validateForm() {
        this.setState({
            formValid:
                this.state.titleValid &&
                this.state.descriptionValid
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

    processPublishData() {
        let { title, description } = this.state;
        return {
            "publisher": "",
            "metadata": {
                "main": {
                    "name": title,
                    "dateCreated": new Date().toISOString().substring(0, 19) + 'Z',
                    "author": process.env.REACT_APP_BRAND,
                    "license": "Apache 2.0",
                    "price": "0",
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
                    "offered": false,
                    "basePoster": localStorage.getItem("address"),
                    "posterAction": null,
                    "baseDID": null,
                    "offerDID": null,
                    "categories": [],
                    "tags": [
                        process.env.REACT_APP_BRAND
                    ],
                    "description": description,
                    "copyrightHolder": process.env.REACT_APP_BRAND,
                    "workExample": "image path, id, label",
                    "links": [],
                    "inLanguage": "en"
                }
            }
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('title');
        localStorage.removeItem('description');
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

    async publishToOcean(e) {
        e.preventDefault()
        e.stopPropagation()

        this.setState({ inProcess: true, showPublishForm: false })
        let publishData = this.processPublishData();
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
                <p>{`Job published successfully`}
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
                <p>Publishing your Job to Ocean Protocol</p>
            </div>
        )
    }

    renderPublishForm() {
        let {
            title,
            description,
            address,
            dataurl,
            author,
            copyright,
            formValid,
            errors
        } = this.state;

        return (
            <Form
                title="Post a new legal Job"
            >
                <Input
                    type="text"
                    name="title"
                    label="Your Issue"
                    placeholder="Tax returns for 2019"
                    value={title}
                    required
                    help="What type of legal help do you need?"
                    onChange={this.handleUserInput.bind(this)}
                />

                <Input
                    type="textarea"
                    tag="textarea"
                    rows="10"
                    cols="50"
                    name="description"
                    label="Describe your issue"
                    placeholder="I am looking for someone to help me file my tax returns for the year 2019"
                    value={description}
                    required
                    help="Mention in details help you need"
                    onChange={this.handleUserInput.bind(this)}
                />

                <div style={{ textAlign: "center" }}>
                    <Button
                        primary
                        type="submit"
                        disabled={false}
                        onClick={this.publishToOcean.bind(this)}
                    >
                        Post Job
                    </Button>
                </div>

                <FormErrors formErrors={errors} />
            </Form>
        )
    }

    render() {

        return (
            <>

                {
                    this.state.showPublishForm ?
                        this.renderPublishForm() :
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
