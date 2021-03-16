import React from "react";
import classNames from "classnames";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/lib/Async";
import AsyncCreatableSelect from "react-select/lib/AsyncCreatable";
import CreatableSelect from "react-select/lib/Creatable";
import AsyncPaginate from 'react-select-async-paginate';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import Colors from "../../template/Colors";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: "flex",
    padding: "0 0 0 12px"
  },
  valueContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.commons.fontColor
  },
  loadingMessageCSS: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    color: theme.palette.commons.fontColor
  },
  singleValue: {
    fontSize: 16,
    paddingLeft: 1,
    width: "90%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 99,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function LoadingMessage(props) {
  return (
    <Typography
      className={props.selectProps.classes.loadingMessageCSS}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      InputLabelProps={{
        shrink: props.hasValue || props.isFocused
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function IndicatorSeparator() {
  return null;
}

const ClearIndicator = props => {
  return (
    components.ClearIndicator && (
      <components.ClearIndicator {...props}>
        <i
          className={`material-icons ${props.className} `}
          style={{
            backgroundColor: Colors.commons.gray3,
            color: Colors.commons.gray,
            fontSize: "16px",
            borderRadius: "50%"
          }}
        >
          {"close"}
        </i>
      </components.ClearIndicator>
    )
  );
};

const DropdownIndicator = props => {  
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <i
          className={`material-icons ${props.className} `}
          style={{
            backgroundColor: Colors.primary.main,
            color: Colors.commons.white,
            top: "calc(50% - 8px)",
            fontSize: "16px",
            borderRadius: "50%",
            right: "-3px",
            visibility: props.isDisabled ? "hidden" : "visible"
          }}
        >
          {props.selectProps.menuIsOpen ? "arrow_drop_up" : "arrow_drop_down"}
        </i>
      </components.DropdownIndicator>
    )
  );
};

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const customComponents = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  SingleValue,
  ValueContainer,
  IndicatorSeparator,
  ClearIndicator,
  DropdownIndicator,
  LoadingMessage
};

class TextFieldSearch extends React.PureComponent {
  handleCreate = event => {
    this.props.onChange(event);
  }

  handleBlur = event => {
    const { onBlur } = this.props;
    if (onBlur) {
      this.handleCreate(event);
      onBlur(event);
    }
  }

  render() {
    const {
      classes,
      theme,
      label,
      loadOptions,
      components,
      isCreatable,
      withPaginate,
      forwardedRef,
      ...others
    } = this.props;

    const selectStyles = {
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#ccc"
          : state.isFocused
          ? "#e9e9e9"
          : "#fff",
        color: Colors.commons.fontColor,
        cursor: "pointer",
        fontFamily: "Nexa",
        fontSize: "14px",
        width: "100%",
        ":active": {
          backgroundColor: state.isSelected ? "#999" : "#e9e9e9",
          color: Colors.commons.fontColor
        }
      }),
      control: (provided, state) => ({
        ...provided,
        width: "100%",
        minHeight: 0,
        padding: "1px 0 1px 8px",
        fontSize: "14px",
        fontFamily: "Nexa",
        color: Colors.commons.fontColor,
        backgroundColor: "#fff",
        borderColor: state.isDisabled
          ? null
          : state.isFocused
          ? Colors.primary.main
          : "#999",
        borderRadius: "5px",
        borderWidth: "0.5",
        boxShadow: state.isFocused ? `0 0 0 0.5 ${Colors.primary.main}` : null,
        cursor: "pointer",
        "&:hover": {
          borderColor: state.isFocused ? Colors.primary.main : "#999"
        }
      }),
      placeholder: provided => ({
        ...provided,
        color: Colors.commons.placeholderColor
      }),
      input: provided => ({
        ...provided,
        color: Colors.commons.fontColor
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";

        return { ...provided, opacity, transition };
      },
      clearIndicator: provided => ({
        ...provided,
        padding: 9,
        cursor: "pointer"
      }),
      dropdownIndicator: provided => ({
        ...provided,
        padding: 9,
        cursor: "pointer"
      })
    };

    const reactSelectProps = {
      ref: forwardedRef,
      classes,
      styles: selectStyles,
      components: {
        ...customComponents,
        ...components
      },
      noOptionsMessage: ({ inputValue }) => {
        if (typeof inputValue === "string" && inputValue.length) {
          return "Nenhum item encontrado";
        }
        return "Digite para pesquisar";
      },
      loadingMessage: () => "Carregando...",
      isClearable: true,
      cacheOptions: true
    };

    const textFieldProps = {
      label
    };
    
    if (isCreatable && typeof loadOptions === "function") {
      return (
        <AsyncCreatableSelect
          {...reactSelectProps}
          loadOptions={loadOptions}
          {...others}
          textFieldProps={textFieldProps}
          onBlur={this.handleBlur} 
          onBlurResetsInput={false} 
          onCreateOption={this.handleCreate}
        />
      );
    }
    
    if (isCreatable) {
      return (
        <CreatableSelect
          {...reactSelectProps}
          {...others}
          textFieldProps={textFieldProps}
        />
      );
    }
    
    if (withPaginate && typeof loadOptions === "function") {
      return (
        <AsyncPaginate
          {...reactSelectProps}
          loadOptions={loadOptions}
          {...others}
          textFieldProps={textFieldProps}
        />
      );
    }

    if (typeof loadOptions === "function") {
      return (
        <AsyncSelect
          {...reactSelectProps}
          loadOptions={loadOptions}
          {...others}
          textFieldProps={textFieldProps}
        />
      );
    }

    return (
      <Select
        {...reactSelectProps}
        {...others}
        textFieldProps={textFieldProps}
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  React.forwardRef((props, ref) => {
    return <TextFieldSearch {...props} forwardedRef={ref} />;
  })
);
