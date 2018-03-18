import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import { _ } from 'meteor/underscore'

import { Kwote, Authors } from '../../lib/kwote'

class AuthorItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: this.props.author,
            firstNameClass: 'form-control',
            lastNameClass: 'form-control',
            errorMessage: ''
        }
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.firstNameChanged = this.firstNameChanged.bind(this)
        this.lastNameChanged = this.lastNameChanged.bind(this)
        this.birthDateChanged = this.birthDateChanged.bind(this)
        this.deathDateChanged = this.deathDateChanged.bind(this)
        this.commentsChanged = this.commentsChanged.bind(this)
    }

    formatDate(value) {
        if (value) {
            if (moment(value, 'MM/DD/YYYY').isValid()) {
                return moment(value, 'MM/DD/YYYY').format('MM/DD/YYYY')
            }
        }
        return ''
    }

    formIsValid() {
        let hasError = 0

        let { firstNameClass, lastNameClass, errorMessage } = this.state

        if (this.state.author.firstName === '') {
            firstNameClass = 'form-control form-error'
            errorMessage = 'Author first name is required!'
            hasError += 1
        } else {
            firstNameClass = 'form-control'
        }

        if (this.state.author.lastName === '') {
            lastNameClass = 'form-control form-error'
            errorMessage = 'Author last name is required!'
            hasError += 1
        } else {
            lastNameClass = 'form-control'
        }

        this.setState({ lastNameClass, firstNameClass, errorMessage })

        return hasError === 0
    }

    firstNameChanged(event) {
        const { author } = this.state
        author.firstName = event.target.value
        this.setState({ author })
    }

    lastNameChanged(event) {
        const { author } = this.state
        author.lastName = event.target.value
        this.setState({ author })
    }

    birthDateChanged(event) {
        const { author } = this.state
        author.birthDate = this.formatDate(event.target.value)
        this.setState({ author })
    }

    deathDateChanged(event) {
        const { author } = this.state
        author.deathDate = this.formatDate(event.target.value)
        this.setState({ author })
    }

    commentsChanged(event) {
        const { author } = this.state
        author.comments = event.target.value
        this.setState({ author })
    }

    saveClick() {
        if (this.formIsValid()) {
            const { author } = this.state
            if (author.birthDate) {
                author.birthDate = this.formatDate(author.birthDate)
            }
            if (author.deathDate) {
                author.deathDate = this.formatDate(author.deathDate)
            }

            this.props.handleSave(author)
        }
    }

    birthDate() {
        const { author } = this.state
        return this.formatDate(author.birthDate)
    }

    deathDate() {
        const { author } = this.state
        return this.formatDate(author.deathDate)
    }

    cancelClick() {
        this.props.handleCancel()
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="form-group">
                        <label>First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="Author first name"
                            className={this.state.firstNameClass}
                            value={this.state.author.firstName}
                            onChange={this.firstNameChanged}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Author last name"
                            className={this.state.lastNameClass}
                            value={this.state.author.lastName}
                            onChange={this.lastNameChanged}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            id="birthDate"
                            className="form-control"
                            value={this.birthDate()}
                            onChange={this.birthDateChanged}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Death</label>
                        <input
                            type="date"
                            id="deathDate"
                            className="form-control"
                            value={this.deathDate()}
                            onChange={this.deathDateChanged}
                        />
                    </div>

                    <div className="form-group">
                        <label>Comments</label>
                        <textarea
                            id="comments"
                            rows="5"
                            className="form-control"
                            placeholder="Additional comments..."
                            value={this.state.author.comments}
                            onChange={this.commentsChanged}
                        />
                    </div>

                    <div style={{
                        width: '100%', color: '#ccc', fontSize: '.8em'
                    }}>
                        * required item
                    </div>

                    <div style={{ width: '100%', color: '#990000', textAlign: 'center' }}>
                        {this.state.errorMessage}
                    </div>

                    <div className="pull-right">
                        <Kwote.Components.SpinButton
                            label="Save"
                            handleClick={this.saveClick}
                            activeBtnClass="btn-success"
                        />

                        <Kwote.Components.SpinButton
                            label="Cancel"
                            handleClick={this.cancelClick}
                            activeBtnClass="btn-default"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

AuthorItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    author: PropTypes.object
};

AuthorItem.defaultProps = {
    author: {
        _id: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        comments: ''
    }
}

module.exports = AuthorItem
