import React, { Component } from 'react'
import AssetList from './AssetList'
import Correct from './Correct'
import Incorrect from './Incorrect'
import Button from './Button'
import Input from './Form/Input'
import Form from './Form/Form'
import * as ethereumAddress from 'ethereum-address'
import styles from './Offers.module.scss';


export default class Offers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            showData: false,
            showFailure: false,
            showSuccess: false,
            hideWalletForm: false,
            addressValid: false,
            query: process.env.REACT_APP_BRAND,
            address: localStorage.getItem("address") || "",
            data: [],
            formValid: true,
            formErrors: {
                address: ''
            }
        }
    }

    async componentDidMount() {
        if (ethereumAddress.isAddress(this.state.address)) {
            this.fetchDataAssets();
        }
    }

    filterAllOffers(results) {
        let myJobs = results.filter((result) => {
            let info = result.service[0].attributes
            let name = info.main.name
            let whitelisted = name.startsWith("Offer")
            let self = result.service[0].attributes.additionalInformation.offerPoster == this.state.address
            return (whitelisted && self)
        })
        return myJobs
    }

    async checkOfferStatus(results, myOffers) {
        let offers = await Promise.all(myOffers.map((offer) => {
            let accepted = results.filter(result => {
                if (result.service[0].attributes.main.name.startsWith("Accepted")) {
                    let offerDID = result.service[0].attributes.additionalInformation.offerDID
                    if (offerDID == offer.id) {
                        return true
                    }
                }

            })
            return { offer, accepted }
        }))

        return offers
    }


    async fetchDataAssets() {
        this.setState({
            inProgress: true
        })

        try {
            const url = `https://aquarius.commons.oceanprotocol.com/api/v1/aquarius/assets/ddo/query?text=${this.state.query}&offset=500`

            let encodedUrl = encodeURI(url);
            const response = await fetch(encodedUrl, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            const { results } = await response.json()
            if (response.status !== 200) {
                this.setState({
                    inProgress: false,
                    showFailure: true,
                    showSuccess: false
                })
            } else {

                let myOffers = await this.filterAllOffers(results)
                let offers = await this.checkOfferStatus(results, myOffers)
                console.log(offers)
                this.setState({
                    inProgress: false,
                    showData: true,
                    data: offers,
                    showSuccess: true,
                    showFailure: false
                })
            }

        } catch (error) {
            console.log(error.message);
        }

    }

    async saveWalletAddress(e) {
        e.preventDefault();
        e.stopPropagation()
        this.validateWalletAddress("address", this.state.address);
        this.setState({ hideWalletForm: true })
        await this.fetchDataAssets();
    }

    handleUserInput(e) {
        const { name, value } = e.target

        this.setState({ [name]: value }, () => {
            this.validateWalletAddress(name, value)
            localStorage.setItem(name, value)
        })
    }

    validateWalletAddress(name, value) {
        if (name != "address") {
            return
        }
        let fieldValidationErrors = this.state.formErrors
        let addressValid = ethereumAddress.isAddress(value)
        fieldValidationErrors.address = addressValid
            ? ''
            : ' is not a valid ethereum address'
        this.setState(
            {
                formErrors: fieldValidationErrors,
                addressValid
            },
            this.validateForm
        )
    }

    validateForm() {
        this.setState({
            formValid: this.state.addressValid
        })
    }

    renderSearchSuccess() {
        return (
            <div>
                <Correct loadComplete={true} />
                <p>{`Found ${this.state.data.length} assets 🎉🎉`}</p>
                <div style={{ textAlign: "center" }}>
                    <Button
                        primary
                        onClick={this.showResults.bind(this)}
                    >
                        View Results
                </Button>
                </div>
            </div >
        )
    }

    renderSearchFailure() {
        return (
            <>
                <Incorrect />
                <p style={{ color: "#D06079" }}>Oops! some error occured while getting data assets for
                <br />
                    {`${this.state.address}`}</p>
                <Button
                    primary
                    onClick={this.fetchDataAssets.bind(this)}
                >
                    Search Again
                </Button>
            </>
        )
    }
    renderSearchInProgress() {
        return (
            <div>
                <Correct loadComplete={false} />
                <p>Getting your offers ✨✨</p>
            </div>
        )
    }
    renderWalletForm() {
        let { address, formValid, formErrors } = this.state
        return (
            <div className={styles.container}>
                <Form
                    title="Set your Wallet Address"
                    description="This wallet address will be used to publish data assets."
                >
                    <div className={styles.searchbar}>
                        <Input
                            type="text"
                            name="address"
                            placeholder={address ? address : "Your Wallet Address"}
                            value={address}
                            help="Enter your valid Ethereum Address"
                            onChange={this.handleUserInput.bind(this)}
                        />
                        <div style={{ textAlign: "center" }}>
                            <Button
                                primary
                                type="submit"
                                disabled={!formValid}
                                onClick={this.saveWalletAddress.bind(this)}
                            >
                                Save My Wallet Address
                        </Button>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
    renderDataAssets() {
        console.log(this.state.data)
        return (
            <div>
                <h2>{this.state.data.length ? this.state.data.length : 0} offers posted by you</h2>
                <hr />
                {
                    this.state.data.length ?
                        <AssetList nextDisplay={this.props.nextDisplay} data={this.state.data} type={"offer"} /> :
                        (
                            <h5>Try submitting an offer to a job</h5>
                        )
                }

            </div >
        )
    }
    render() {
        return (
            (!ethereumAddress.isAddress(this.state.address) && !this.state.hideWalletForm) ?
                this.renderWalletForm() :
                (this.state.showData ?
                    this.renderDataAssets() :
                    (this.state.inProgress ?
                        this.renderSearchInProgress() :
                        (this.state.showSuccess ?
                            this.renderSearchSuccess() :
                            (this.state.showFailure ?
                                this.renderSearchFailure() :
                                this.renderWalletForm()))))

        )
    }
}
