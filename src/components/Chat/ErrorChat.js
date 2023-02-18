import PT from "prop-types";
import { CONTACT_STATUS } from "../../constants/global";
import ChatErrorActionBar from "./ChatErrorActionBar";
import ChatErrorTranscriptor from "./ChatErrorTranscriptor";
import React, { Component } from "react";
import { Text } from "connect-core";
import styled from "styled-components";
import {Direction, Status } from "./datamodel/Model";
import  {modelUtils} from "./datamodel/Utils";
import renderHTML from 'react-render-html';

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;


const HeaderWrapper = styled.div`
  background: #0C8281;
  text-align: center;
  padding: 20px;
  color: #fff;
  border-radius: 3px;
  flex-shrink: 0;
`
const WelcomeText = styled(Text)`
  padding-bottom: 10px;
`


const defaultHeaderConfig = {
  isHTML: false,
  render: () => {
    return (
      <HeaderWrapper>
        <WelcomeText type={'h2'}>Chat with Customer Care</WelcomeText>
      </HeaderWrapper>
    )
  }
};

Header.defaultProps = {
  headerConfig: {}
}

function Header({ headerConfig }) {

  const config = Object.assign({}, defaultHeaderConfig, headerConfig);

  if (config.isHTML) {
    return renderHTML(config.render());
  } else {
    return config.render();
  }
}


export default class Chat extends Component {
  constructor(props) {
    super(props);
    console.log("Inside Chat Main Component", props);

    this.state = {
      transcript: this.getErrorTranscipt(),
      typingParticipants: [],
      contactStatus: CONTACT_STATUS.DISCONNECTED
    };
  }


  closeChat() {
    window.open('','_self').close();
    document.location.href = '/end-chat';

  }
  getErrorTranscipt() {
    var item = modelUtils.createItemForError({
        AbsoluteTime: "2022-04-28T05:33:55.337Z",
        Content: "We're currently unable to connect you with an Amazon Pharmacy Customer Care agent through chat. You can call us at 855-745-5725 or start another chat session later.",
        ContentType: "text/plain",
        DisplayName: "SYSTEM_MESSAGE",
        Id: "f51af73b-1404-4fac-8796-0f1ddae2d30a",
        ParticipantId: "df0df5e2-d838-4cc4-9a4e-43994a26b67f",
        ParticipantRole: "SYSTEM",
        Type: "MESSAGE",
       }, {participantId: "0"});
   return [item];
  }

  render() {
    const { headerConfig } = this.props;
    console.log('MESSAGES', this.state.transcript);

    return (
      <ChatWrapper>
        <Header headerConfig={headerConfig} />
        <ChatErrorTranscriptor
          transcript={this.state.transcript}
          contactStatus={this.state.contactStatus}
          contactId="1234"
        />
        {<ChatErrorActionBar
          onClose={() => this.closeChat()}
        />
        }
      </ChatWrapper>
    );
  }
}
