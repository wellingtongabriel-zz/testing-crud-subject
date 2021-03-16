import React from 'react';

import styled from 'styled-components';
import Colors from "../../template/Colors";

const Button = styled.button `
  width: 114px;
  height: 40px;
  box-shadow: 0px 5px 25px rgba(38, 172, 169, 0.07), 0px 7px 25px rgba(38, 172, 169, 0.08), 0px 10px 15px rgba(0, 0, 0, 0.03);
  border-radius: 100px;
  background: ${Colors.commons.gray7};
  color: ${Colors.commons.grayLight};
  font-weight: 900;
  margin: 0px 10px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  &.active {
      background-color: ${Colors.commons.secondary};
  }
`;

class Radio extends React.Component {
   
  onClick = (value) => {
    const {onChange} = this.props;
    onChange && onChange(value);
  }
  
  render() {
    const { value, label, checked, icon} = this.props;
    const Icon = icon;
    return (
      <Button className={checked ? 'active' : ''} onClick={() => this.onClick(value)}>
        <Icon style={{fontSize:24, verticalAlign: 'middle'}} /> <span>{label}</span>
      </Button>
    );
  }
}

class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
    this.options = [];
  }

  getChildContext() {
    const {name} = this.props;
    return {radioGroup: {
      name,
      onChange: this.onChange.bind(this)
    }};
  }
  
  onChange(selected, child) {
    this.options.forEach(option => {
      if (option !== child) {
        option.setSelected(!selected);
      }
    });
  }
  
  render() {
    let children = React.Children.map(this.props.children, child => {
      child.onChange = this.onChange;
      return React.cloneElement(child, {
        ref: (component => {this.options.push(component);}) 
      });
    });
    return <div className="radio-group">{children}</div>;
  }
}


export {
  Radio,
  RadioGroup,
}