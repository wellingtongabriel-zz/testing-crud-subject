import React from 'react';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import Colors from "../../template/Colors";
import FormControl from "@material-ui/core/FormControl/FormControl";

function noOptionsMessage() {
    return 'Digite para pesquisar'
}

function loadingMessage() {
    return 'Carregando...'
}

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#ccc' : (state.isFocused ? '#e9e9e9' : '#fff'),
        color: Colors.commons.fontColor,
        cursor: 'pointer',
        fontFamily: 'Nexa',
        fontSize: '14px',
        width: '100%',
        ':active': {
            backgroundColor: state.isSelected ? '#999' : '#e9e9e9',
            color: Colors.commons.fontColor
        },
    }),
    control: (provided, state) => ({
        ...provided,
        width: '100%',
        minHeight: 0,
        padding: '1px 0 1px 8px',
        fontSize: '14px',
        fontFamily: 'Nexa',
        color: Colors.commons.fontColor,
        backgroundColor: '#fff',
        borderColor: state.isDisabled ? null : state.isFocused ? Colors.primary.main : '#999',
        borderRadius: '5px',
        borderWidth: '0.5',
        boxShadow: state.isFocused ? `0 0 0 0.5 ${Colors.primary.main}` : null,
        cursor: 'pointer',
        '&:hover': {
            borderColor: state.isFocused ? Colors.primary.main : '#999',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: Colors.commons.placeholderColor,
    }),
    input: (provided) => ({
        ...provided,
        color: Colors.commons.fontColor,
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
    }
}

const DropdownIndicator = (props) => {
    return components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
            <i className={`material-icons ${props.className} `}
                style={{
                    backgroundColor: Colors.primary.main,
                    color: Colors.commons.white,
                    top: 'calc(50% - 8px)',
                    fontSize: '16px',
                    borderRadius: '50%',
                    right: '-3px'
                }}>
                {props.selectProps.menuIsOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            </i>
        </components.DropdownIndicator>
    );
};

const ClearIndicator = (props) => {
    return components.ClearIndicator && (
        <components.ClearIndicator {...props}>
            <i className={`material-icons ${props.className} `}
                style={{
                    backgroundColor: Colors.commons.gray3,
                    color: Colors.commons.gray,
                    fontSize: '16px',
                    borderRadius: '50%',
                }}>
                {'close'}
            </i>
        </components.ClearIndicator>
    );
};

export const SelectSearch = props => {
    const { className, elements, placeholder, ...other } = props;

    return <FormControl className={className}>
        <Select
            {...other}
            styles={customStyles}
            placeholder={placeholder}
            isClearable={true}
            components={{ IndicatorSeparator: null, DropdownIndicator, ClearIndicator}}
            noOptionsMessage={noOptionsMessage}
            loadingMessage={loadingMessage}
            options={elements.map(c => ({ value: c.value, label: c.name }))}
        />
    </FormControl>
};



export const SelectSearchAsync = props => {
    const { className, placeholder, ...other } = props;

    return <FormControl className={className}>
        <AsyncSelect
            {...other}
            styles={customStyles}
            cacheOptions
            isClearable={true}
            placeholder={placeholder}
            noOptionsMessage={noOptionsMessage}
            loadingMessage={loadingMessage}
            components={{ IndicatorSeparator: null, DropdownIndicator, ClearIndicator }}
        />
    </FormControl>
};