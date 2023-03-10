import React, { Component } from "react";
import styled from "styled-components";

const FlexLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
`;

const HeaderWrapper = styled(FlexLayout)`
  overflow: auto;
  background: ${props => props.theme.palette.primaryGreen};
  color: ${props => props.theme.palette.white};
`;

export default class Header extends Component {
  constructor(props) {
    super(props);
    console.log("Header called...", props);
  }
  render() {
    return (
      <HeaderWrapper>
        <div>
          <span>CUSTOMER UI</span>
        </div>
      </HeaderWrapper>
    );
  }
}
