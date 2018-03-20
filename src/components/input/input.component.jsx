import React from "react";

export class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isInputFocus: false
        }
    }

    onInputFocus = () => {
        const {onFocus} = this.props;
        this.setState({
            isInputFocus: true
        });
        if (onFocus)
            onFocus();
    };

    onInputFocusOut = () => {
        const {onFocusOut} = this.props;
        this.setState({
            isInputFocus: false
        });
        if (onFocusOut)
            onFocusOut();
    };

    getContainerDynamicClasses() {
        const {isErrorMode} = this.props;
        const {isInputFocus} = this.state;
        const errorClass = isErrorMode ? 'error' : '';
        const focusClass = isInputFocus ? 'focused' : '';
        return `${errorClass} ${focusClass}`;
    }

    onChange(e) {
        const value = e.target.value;
        this.setState({
            value
        });
        this.props.onChange(value);
    }

    render() {
        const {type, icon, className, onClick, value, isReadOnly} = this.props;

        return (
            <div className={`input-container ${this.getContainerDynamicClasses()} ${className}`}>
                <input type={type}
                       onChange={this.onChange}
                       value={value}
                       onBlur={this.onInputFocusOut}
                       onClick={onClick}
                       onFocus={this.onInputFocus}/>
                <div className="icon-container">{icon}</div>
            </div>
        );
    }
}