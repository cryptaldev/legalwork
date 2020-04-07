import React, { Component } from 'react'
import Input from '../components/Form/Input'
import Button from '../components/Button'
import Form from '../components/Form/Form'
import styles from './Search.module.scss'
import { FormErrors } from './FormErrors'
import Correct from './Correct'
import Incorrect from './Incorrect'
import AssetList from './AssetList';


export default class Search extends Component {
    state = {
        searchQuery: '',
        searchValid: false,
        inProgress: false,
        formValid: false,
        showResults: false,
        showFailure: false,
        showSuccess: false,
        searchResults: [],
        formErrors: {
            search: ''
        }
    }

    handleUserInput = e => {
        const { name, value } = e.target
        console.log(this.state.searchQuery)
        this.setState({ [name]: value }, () => {
            this.validateSearch(value)
        })
    }

    async searchInOcean(e) {
        e.preventDefault()
        e.stopPropagation()

        this.setState({
            inProgress: true
        })

        try {
            const url = `https://aquarius.commons.oceanprotocol.com/api/v1/aquarius/assets/ddo/query?text=${this.state.searchQuery}&offset=500`

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
                this.setState({
                    inProgress: false,
                    searchResults: results.slice(),
                    showSuccess: true,
                    showFailure: false
                })
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    validateSearch(value) {
        let fieldValidationErrors = this.state.formErrors
        let { searchValid } = this.state

        searchValid = value.length > 1
        fieldValidationErrors.search = searchValid ? '' : ' is too short'

        this.setState(
            {
                formErrors: fieldValidationErrors,
                searchValid
            },
            this.validateForm
        )
    }

    validateForm() {
        this.setState({
            formValid: this.state.searchValid
        })
    }

    showResults() {
        this.setState({
            showResults: true
        })
    }

    renderResults() {
        return (
            <AssetList data={this.state.searchResults} />
        )
    }
    renderSearchSuccess() {
        return (
            <div>
                <Correct loadComplete={true} />
                <p>{`Search successful 😎✔️`}
                    <br />
                    {`Found ${this.state.searchResults.length} results 🎉🎉`}
                </p>


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
                <p style={{ color: "#D06079" }}>Oops! some error occured while publishing</p>
                <Button
                    primary
                    onClick={this.searchInOcean.bind(this)}
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
                <p>{`Searching Commons for "${this.state.searchQuery}"`}</p>
            </div>
        )
    }

    renderSearchForm() {
        let { searchQuery, formValid, formErrors } = this.state
        return (
            <div className={styles.container}>
                <Form
                    title="Search In Commons"
                    description="Search for any open data asset."
                >
                    <div className={styles.searchbar}>
                        <Input
                            type="text"
                            name="searchQuery"
                            placeholder="blocks"
                            value={searchQuery}
                            onChange={this.handleUserInput}
                        />
                        <div style={{ textAlign: "center" }}>
                            <Button
                                primary
                                type="submit"
                                disabled={!formValid}
                                onClick={this.searchInOcean.bind(this)}
                            >
                                Search Commons
                        </Button>
                        </div>
                    </div>
                    <FormErrors formErrors={formErrors} />
                </Form>
            </div>
        )
    }
    render() {

        return (
            this.state.showResults ?
                this.renderResults() :
                (this.state.inProgress ?
                    this.renderSearchInProgress() :
                    (this.state.showSuccess ?
                        this.renderSearchSuccess() :
                        (this.state.showFailure ?
                            this.renderSearchFailure() :
                            this.renderSearchForm()))))
    }
}
