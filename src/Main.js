import React, { Component } from "react";
import styled from "styled-components";
import ChatContainer from "./components/Chat/ChatContainer";

const MainBody = styled.div`
  height: 100%;
  overflow: auto;
`;

class Main extends Component {
  render() {
    return (
      <MainBody>
        <ChatContainer key="ChatContainer" />
      </MainBody>
    );
  }
}
export default Main;
