/* global _ Brackets TIU  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Kwote } from '../../lib/kwote'

class KwoteItem extends Component {
    constructor(props) {
        super(props);
        // this.state = { selected: false, fading: false };
        this.saveClick = this.saveClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        // this.fadingDone = this.fadingDone.bind(this);
    }

    // componentDidMount() {
    //     this.bracketBox.addEventListener('animationend', this.fadingDone);
    // }

    // componentWillUnmount() {
    //     this.bracketBox.removeEventListener('animationend', this.fadingDone);
    // }

    // fadingDone() {
    //     let { isFading } = this.state;
    //     isFading = false
    //     this.setState({ fading: isFading })
    // }

    saveClick(event) {
        event.stopPropagation();

        let { isSelected, isFading } = this.state;
        const retVal = this.props.handleSave(true, this.props.kwote);
        isSelected = retVal.selected;
        isFading = retVal.animate;

        // this.setState({ selected: isSelected, fading: isFading });
    }

    cancelClick(event) {
        event.stopPropagation();
        this.props.handleCancel()
    }

    render() {
        const b = this.props.kwote

        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="form-group">
                        <input type="text" className="form-control" id="title" placeholder="Title" />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" id="body" placeholder="Paste or type quote body here" />
                    </div>

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
        )
    }
}

KwoteItem.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    kwote: PropTypes.object
};

KwoteItem.defaultProps = {
    kwote: null
}

module.exports = KwoteItem;
