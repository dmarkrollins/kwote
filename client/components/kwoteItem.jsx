/* global _ Brackets TIU  */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Editor, EditorState, RichUtils } from 'draft-js';

import { Kwote } from '../../lib/kwote'
import '../../client/utils'
import '../../node_modules/react-select/dist/react-select.min.css';

class KwoteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: this.props.kwote.body,
            kwote: this.props.kwote,
            titleError: 'form-control',
            bodyError: '',
            errorMessage: ''
        };
        this.saveClick = this.saveClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.categoryChanged = this.categoryChanged.bind(this)
        this.bodyChanged = this.bodyChanged.bind(this)
        this.isOptionUnique = this.isOptionUnique.bind(this)
        this.projectChanged = this.projectChanged.bind(this)
        this.authorChanged = this.authorChanged.bind(this)
        this.manageAuthors = this.manageAuthors.bind(this)
        this.manageProjects = this.manageProjects.bind(this)
        this.setBlockStyle = this.setBlockStyle.bind(this)
        this.setInlineStyle = this.setInlineStyle.bind(this)
        // this.handleKeyCommand = this.handleKeyCommand.bind(this)
    }

    setBlockStyle(blockStyle) {
        const newState = RichUtils.toggleBlockType(this.state.editorState, blockStyle)
        this.setState({ editorState: newState })
    }

    setInlineStyle(inlineStyle) {
        const newState = RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
        this.setState({ editorState: newState })
    }

    handleKeyCommand = (keyCommand) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, keyCommand)

        if (newState) {
            this.setState({ editorState: newState })
            return 'handled'
        }

        return 'not-handled'
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
            this.setState({ bodyError: 'form-error' })
            hasError += 1
        } else {
            this.setState({ bodyError: '' })
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
        kwote.title = event.target.value
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

    categoryChanged(values) {
        var uniqueList = _.uniq(values, function (item) {
            return item.value.toProperCase();
        });

        const newValues = _.map(uniqueList, function (item) {
            item.value = item.value.toProperCase();
            item.label = item.label.toProperCase();
            return item;
        })

        const { kwote } = this.state
        kwote.categories = newValues
        this.setState({ kwote })
    }

    bodyChanged(editorState) {
        this.setState({ editorState })
    }

    projectChanged(projects) {
        var uniqueList = _.uniq(projects, function (item) {
            return item.value.toProperCase();
        });

        const newValues = _.map(uniqueList, function (item) {
            item.value = item.value.toProperCase();
            item.label = item.label.toProperCase();
            return item;
        })

        const { kwote } = this.state
        kwote.projects = newValues
        this.setState({ kwote })
    }

    authorChanged(author) {
        const { kwote } = this.state;
        kwote.author = author
        this.setState({ kwote })
    }

    manageAuthors() {
        // collect values into session object
        // navigate to new author
    }

    manageProjects() {
        // collect values into session object
        // navigate to new project
    }

    hasError(fieldName) {

    }

    render() {
        const b = this.props.kwote
        const { options, values } = this.state;

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="form-group">
                        <label>Short Description / Title</label>
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
                        <div style={{
                            whiteSpace: 'nowrap',
                            padding: '0',
                            margin: '0',
                            width: '100%',
                            display: 'table'
                        }}>
                            <div style={{ display: 'table-cell' }}>
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
                                />
                            </div>
                            <div style={{
                                display: 'table-cell',
                                width: '50px',
                                textAlign: 'right'
                            }}>
                                <button id="btnAuthors" className="btn btn-primary" title="Tap to create new author" onClick={this.manageAuthors}><i className="fa fa-plus-circle" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group multi-selector">
                        <label>Project Tags</label>
                        <Select.Creatable
                            id="categorySelect"
                            multi={true}
                            options={this.props.projects}
                            onChange={this.projectChanged}
                            value={this.state.kwote.projects}
                            placeholder="Choose or enter a new project tag"
                            isOptionUnique={this.isOptionUnique}
                            closeOnSelect={false}
                        />
                    </div>

                    <div className="form-group multi-selector">
                        <label>Category Tags</label>
                        <Select.Creatable
                            id="categorySelect"
                            multi={true}
                            options={this.props.categories}
                            onChange={this.categoryChanged}
                            value={this.state.kwote.categories}
                            placeholder="Choose or enter a new category tag"
                            isOptionUnique={this.isOptionUnique}
                            closeOnSelect={false}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kwote Body</label><br />
                        <div className="btn-group" role="group" >
                            <button className="btn btn-secondary" id="bold" onClick={() => this.setInlineStyle('BOLD')}><i className="fa fa-bold" style={{ fontSize: '.833em' }} /></button>
                            <button className="btn btn-secondary" id="italic" onClick={() => this.setInlineStyle('ITALIC')}><i className="fa fa-italic" style={{ fontSize: '.833em' }} /></button>
                            <button className="btn btn-secondary" id="underline" onClick={() => this.setInlineStyle('UNDERLINE')}><i className="fa fa-underline" style={{ fontSize: '.833em' }} /></button>
                            <button className="btn btn-secondary" id="unorderedList" onClick={() => this.setBlockStyle('unordered-list-item')}><i className="fa fa-list-ul" style={{ fontSize: '.833em' }} /></button>
                            <button className="btn btn-secondary" id="orderedList" onClick={() => this.setBlockStyle('ordered-list-item')}><i className="fa fa-list-ol" style={{ fontSize: '.833em' }} /></button>
                        </div>
                        <div className="editor">
                            <Editor
                                editorState={this.state.editorState}
                                onChange={this.bodyChanged}
                                className={this.state.bodyError}
                                spellCheck={true}
                                handleKeyCommand={this.handleKeyCommand}
                            />
                        </div>
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
        title: '',
        body: EditorState.createEmpty(),
        categories: [],
        projects: [],
        author: ''
    },
    projects: [{ value: 'Project 1', label: 'Project 1' }, { value: 'Project 2', label: 'Project 2' }, { value: 'Project 3', label: 'Project 3' }],
    authors: [{ value: 'Author 1', label: 'Author 1' }, { value: 'Author 2', label: 'Author 2' }, { value: 'Author 3', label: 'Author 3' }],
    categories: [{ value: 'Category 1', label: 'Category 1' }]
}

module.exports = KwoteItem;
