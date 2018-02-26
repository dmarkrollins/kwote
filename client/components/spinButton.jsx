import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SpinButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = { animating: false };
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { animating } = this.state;
        animating = nextProps.isSpinning;
        this.setState({ animating: animating });
    }

    handleClick(event) {
        event.stopPropagation();

        // const state = this.state;
        // state.animating = true;
        // this.setState(state);

        this.props.handleClick(this.props.clickHandlerData);
    }

    buttonClass() {
        let buttonSize = ''; // no size
        let buttonDisabled = '';
        let buttonColor = '';
        let buttonPadding = '';
        let buttonHidden = '';

        switch (this.props.btnSize) {
            case 'large':
                buttonSize = 'btn-lg';
                break;
            case 'small':
                buttonSize = 'btn-sm';
                break;
            case 'extra-small':
                buttonSize = 'btn-xs';
                break;
            case 'block':
                buttonSize = 'btn-block';
                break;
            default:
                buttonSize = '';
                break;
        }

        if (this.state.animating || (this.props.icon.length > 0 && this.props.icon !== this.props.iconEmptyClass)) {
            buttonPadding = this.props.iconPaddingClass;
        }

        if (this.state.animating) {
            buttonColor = 'btn-default';
            buttonDisabled = 'disabled';
        } else {
            buttonColor = this.props.activeBtnClass;
        }

        if (this.props.isActive !== true && this.state.animating === false) {
            buttonDisabled = 'disabled';
        }

        if (this.props.isVisible === false) {
            buttonHidden = 'hidden';
        }

        return `btn ${buttonColor} ${buttonSize} ${buttonPadding} ${buttonDisabled} ${buttonHidden} ${this.props.extraButtonClass}`;
    }

    isDisabled() {
        if (!this.props.isActive || this.state.animating) {
            return true;
        }
        return false;
    }

    iconComponent() {
        let iconClass;

        if (this.state.animating) {
            iconClass = 'fa fa-cog fa-spin';

            if (this.props.label.length === 0) {
                // padding: 50px 30px 50px 80px;
                return <span className={iconClass} />;
            }

            return <span className={iconClass} style={{ marginRight: '4px' }} />;
        }

        if (this.props.icon.length > 0) {
            iconClass = `${this.props.icon}`;

            if (this.props.label.length === 0) {
                return <span className={iconClass} />;
            }

            return <span className={iconClass} style={{ marginRight: '4px' }} />;
        }

        if (this.props.label.length === 0) {
            return <span className="fa fa-cog" />;
        }

        return '';
    }

    render() {
        return (

            <button
                type="button"
                className={this.buttonClass()}
                onClick={this.handleClick}
                disabled={this.isDisabled()}
                ref={(ref) => {
                    this.actionBtn = ref;
                }}
            >
                {this.iconComponent()}{this.props.label}
            </button>

        );
    }
}

SpinButton.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    isActive: PropTypes.bool,
    isSpinning: PropTypes.bool,
    handleClick: PropTypes.func.isRequired,
    activeBtnClass: PropTypes.string,
    clickHandlerData: PropTypes.any,
    isVisible: PropTypes.bool,
    btnSize: PropTypes.oneOf(['large', 'small', '', 'extra-small', 'block']),
    iconPaddingClass: PropTypes.string,
    iconEmptyClass: PropTypes.string,
    extraButtonClass: PropTypes.string
};

SpinButton.defaultProps = {
    label: '',
    icon: '',
    isActive: true,
    isSpinning: false,
    activeBtnClass: 'btn-primary',
    clickHandlerData: '',
    isVisible: true,
    btnSize: '',
    iconPaddingClass: 'spin-icon-padding',
    iconEmptyClass: 'empty-icon',
    extraButtonClass: ''
};

module.exports = SpinButton;
