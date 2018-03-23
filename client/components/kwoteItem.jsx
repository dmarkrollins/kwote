import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Trumbowyg from 'react-trumbowyg'
import { $ } from 'meteor/jquery'
import { _ } from 'meteor/underscore'

import { Kwote } from '../../lib/kwote'

import '../../client/utils'
import '../../node_modules/react-select/dist/react-select.min.css'
import '../../node_modules/react-trumbowyg/dist/trumbowyg.min.css'

class KwoteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kwote: Object.assign({}, this.props.kwote),
            titleError: 'form-control',
            bodyError: '', // eslint-disable-line
            errorMessage: ''
        };
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.categoryChanged = this.categoryChanged.bind(this)
        this.isOptionUnique = this.isOptionUnique.bind(this)
        this.projectChanged = this.projectChanged.bind(this)
        this.authorChanged = this.authorChanged.bind(this)
        this.manageAuthors = this.manageAuthors.bind(this)
        this.editorChanged = this.editorChanged.bind(this)
        // console.log(this.props.projects)
        // console.log(this.props.categories)
    }

    formIsValid() {
        let hasError = 0
        if (this.state.kwote.title === '') {
            this.setState({ titleError: 'form-control form-error' })
            hasError += 1
        } else {
            this.setState({ titleError: 'form-control' })
        }

        if (this.state.kwote.body === '') {
            // this.props.handleBodyError(true)
            $('#kwoteBody').addClass('form-error')
            hasError += 1
        } else {
            // this.props.handleBodyError(false)
            $('#kwoteBody').removeClass('form-error')
        }

        this.setState({ errorMessage: hasError > 0 ? 'Required Kwote information missing!' : '' })

        return hasError === 0
    }

    saveClick() {
        if (this.formIsValid()) {
            this.props.handleSave(this.state.kwote)
        }
    }

    cancelClick(data) {
        this.props.handleCancel()
    }

    handleTitleChange(event) {
        const { kwote } = this.state
        kwote.title = event.target.value.toProperCase()
        this.setState({ kwote })
    }

    isOptionUnique(prop) {
        const { option } = prop;
        const { values } = this.state

        const compareItem = option.value.toProperCase()

        const list = _.find(values, function (item) {
            return item.value === compareItem
        })

        return !list
    }

    processSelectList(values) {
        var uniqueList = _.uniq(values, function (item) {
            return item.value.toProperCase()
        });

        const newValues = _.map(uniqueList, function (item) {
            item.value = item.label === item.value ? 'placeholder' : item.value
            // labal assign must be 2nd due to propercase messing up equal check
            item.label = item.label.toProperCase()
            return item
        })

        return newValues
    }

    categoryChanged(values) {
        const newValues = this.processSelectList(values)
        const { kwote } = this.state
        kwote.categories = newValues
        this.setState({ kwote })
    }

    projectChanged(values) {
        const newValues = this.processSelectList(values)
        const { kwote } = this.state
        kwote.projects = newValues
        this.setState({ kwote })
    }

    authorChanged(author) {
        const { kwote } = this.state
        kwote.author = author
        this.setState({ kwote })
    }

    manageAuthors() {
        // collect values into session object
        // navigate to new author
    }

    editorButtons() {
        return [
            ['formatting'],
            ['strong', 'em', 'underline'],
            ['justifyLeft', 'justifyCenter'],
            ['unorderedList', 'orderedList'],
            ['fullscreen']
        ]
    }

    editorChanged(event) {
        const { kwote } = this.state
        kwote.body = event.target.innerHTML
        this.setState({ kwote })
    }

    render() {
        const b = this.props.kwote
        const { options, values } = this.state;

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="form-group">
                        <label>Search Description / Title *</label>
                        <input
                            type="text"
                            id="kwoteTitle"
                            className={this.state.titleError}
                            placeholder="Enter a short description or title"
                            onChange={this.handleTitleChange}
                            value={this.state.kwote.title}
                        />
                    </div>

                    <div className="form-group">
                        <label>Author</label>
                        <Select
                            id="authorSelect"
                            ref={(ref) => { this.select = ref; }}
                            onBlurResetsInput={false}
                            onSelectResetsInput={false}
                            autoFocus
                            options={this.props.authors}
                            clearable={false}
                            disabled={false}
                            value={this.state.kwote.author}
                            onChange={this.authorChanged}
                            searchable={true}
                            placeholder="Choose Author"
                            closeOnSelect={true}
                        />
                    </div>

                    <div className="form-group multi-selector">
                        <label>Project Tags</label>
                        <Select.Creatable
                            id="projectSelect"
                            multi={true}
                            options={this.props.projects}
                            onChange={this.projectChanged}
                            value={this.state.kwote.projects}
                            placeholder="Choose or enter a new project tag"
                            isOptionUnique={this.isOptionUnique}
                        />
                    </div>

                    <div className="form-group multi-selector2">
                        <label>Category Tags</label>
                        <Select.Creatable
                            id="categorySelect"
                            multi={true}
                            options={this.props.categories}
                            onChange={this.categoryChanged}
                            value={this.state.kwote.categories}
                            placeholder="Choose or enter a new category tag"
                            isOptionUnique={this.isOptionUnique}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kwote Body *</label><br />
                        <Trumbowyg
                            id="kwoteBody"
                            data={this.state.kwote.body}
                            placeholder="Paste or enter Kwote here"
                            autogrow={false}
                            imageWidthModalEdit={true}
                            buttons={this.editorButtons()}
                            onChange={this.editorChanged}
                            className={this.state.bodyError}
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

KwoteItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    projects: PropTypes.array,
    authors: PropTypes.array,
    categories: PropTypes.array,
    kwote: PropTypes.object
};

KwoteItem.defaultProps = {
    kwote: {
        _id: '',
        title: '',
        body: '',
        categories: [],
        projects: [],
        author: ''
    },
    projects: [],
    authors: [],
    categories: []
}

module.exports = KwoteItem
