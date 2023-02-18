
''
import React, { Component } from "react";
import styled from "styled-components";
import { Button, Loader } from "connect-core";
import Chat from "./Chat";
import ChatSession from "./ChatSession";
import EventBus from "./eventbus"
import "./ChatInterface"
import { defaultTheme } from "connect-theme";
import { FlexRowContainer } from "connect-theme/Helpers";
import { CHAT_FEATURE_TYPES } from "./constants";
import ErrorChat from "./ErrorChat";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  > button {
    min-width: 85px;
  }
`;


const MessageBoxFail = styled.div`
  padding: 10;
`;

const LoadingWrapper = styled(FlexRowContainer)`
  padding: ${({ theme }) => theme.globals.basePadding};
  height: 100%;
`;


const Wrapper = styled.div`
  padding: ${({ theme }) => theme.globals.basePadding};
  height: 100%;
`;


class ChatContainer extends Component {
  constructor(props) {
    super(props);
    console.log("ChatContainer called...", props);
    this.state = {
      chatSession: null,
      composerConfig: {},
      status: "NotInitiated"
    };

    this.submitChatInitiationHandler = this.submitChatInitiation.bind(this);
    EventBus.on("initChat", this.initiateChatSession.bind(this));
  }


  componentWillUnmount() {
    EventBus.off(this.submitChatInitiationHandler);
  }


  initiateChatSession(chatDetails, success, failure) {
    this.submitChatInitiation(chatDetails, success, failure);
  }

  /**
   * Initiate a chat in 2 steps.
   * 
   * Step 1: Create a chat session within Amazon Connect (more details in ChatInitiator.js)
   * This step provides us with a 'chatDetails' object that contains among others:
   * - Auth Token
   * - Websocket endpoint
   * - ContactId
   * - ConnectionId
   * 
   * Step 2: Connect to created chat session.
   * Open a websocket connection via Chat.JS (more details in ChatSession.js)
   * 
   * @param {*} input 
   * @param {*} success 
   * @param {*} failure 
   */
  async submitChatInitiation(input, success, failure) {
    this.setState({ status: "Initiating" });

    try {
      // const chatDetails = await initiateChat(input);
      const chatDetails = input;
      const chatSession = await this.openChatSession(chatDetails, input.name, input.region, input.stage);

      this.setState({
        status: "Initiated",
        chatSession: chatSession,
        composerConfig: {
          attachmentsEnabled: (input.featurePermissions && input.featurePermissions[CHAT_FEATURE_TYPES.ATTACHMENTS]) || (chatDetails.featurePermissions && chatDetails.featurePermissions[CHAT_FEATURE_TYPES.ATTACHMENTS])
        }
      });
      success && success(chatSession);
    } catch (error) {
      this.setState({ status: "InitiateFailed" });
      failure && failure(error);
    }
  }

  openChatSession(chatDetails, name, region, stage) {
    const chatSession = new ChatSession(chatDetails, name, region, stage);
    return chatSession.openChatSession().then(() => {
      return chatSession;
    });
  }

  resetState = () => {
    this.setState({ status: "NotInitiated", chatSession: null });
  };
  closeWindow = () => {
    this.resetState();
    window.close();
  };

  render() {

    if ("NotInitiated" === this.state.status || "Initiating" === this.state.status) {
      return <LoadingWrapper center={true}>
        <Loader color={defaultTheme.color.primary} size={30} />
      </LoadingWrapper>;
    }

    if ("InitiateFailed" === this.state.status) {
      return (
        // <Wrapper>
          
        //   {/* <MessageBoxFail>We're currently unable to connect you with an Amazon Pharmacy Customer Care agent through chat. You can call us at 855-745-5725 or start another chat session later. </MessageBoxFail>
        //   <ButtonWrapper>
        //     <Button
        //       col="2"
        //       type="tertiary"
        //       onClick={this.closeWindow}
        //     >
        //       <span>Close</span>
        //     </Button>
        //   </ButtonWrapper> */}
        // </Wrapper>
        <ErrorChat {...this.props}/>
        
      );
    }
    return <Chat chatSession={this.state.chatSession} composerConfig={this.state.composerConfig} onEnded={this.resetState} {...this.props} />;
  }
}

export default ChatContainer;
