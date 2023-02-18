


import React, { PureComponent } from "react";
import PT from "prop-types";
import styled from "styled-components";
import { modelUtils } from "../datamodel/Utils";
import { PARTICIPANT_MESSAGE, ATTACHMENT_MESSAGE } from "../datamodel/Model";
import renderHTML from 'react-render-html';
import {
  MessageBox,
  ParticipantMessage,
} from "../ChatTranscriptor/ChatMessages/ChatMessage";
import { SystemMessage } from "../ChatTranscriptor/ChatMessages/SystemMessage";
import ChatTranscriptScroller from "../ChatTranscriptor/ChatTranscriptScroller";

const TranscriptBody = styled.div`
  margin: 0 auto;
`;

const TranscriptWrapper = styled(ChatTranscriptScroller)`
  order: 2;
  flex: 1 1 auto;
  background: ${props => props.theme.chatTranscriptor.background};
`;

const defaultTranscriptConfig = {

  participantMessageConfig: {
    render: ({ ...props }) => {
      return <ParticipantMessage {...props} />;
    }
  },

  attachmentMessageConfig: {
    render: ({ ...props }) => {
      return <ParticipantMessage {...props} />;
    }
  },

  systemMessageConfig: {
    render: ({ ...props }) => {
      return <SystemMessage {...props} />;
    }
  }
};


export default class ChatErrorTranscriptor extends PureComponent {
  static propTypes = {
    contactId: PT.string.isRequired,
    transcript: PT.array,
    typingParticipants: PT.array.isRequired,
    contactStatus: PT.string.isRequired,
  };

  renderMessage = (itemDetails, isLatestMessage) => {
    const itemId = itemDetails.id;
    const version = itemDetails.version;
    const key = itemId + "." + version;

    // const transcriptConfig = Object.assign({}, defaultTranscriptConfig, this.props.transcriptConfig);
    // let config = {
    //   render: transcriptConfig.render,
    //   isHTML: transcriptConfig.isHTML,
    // };

    // let content = null;
    // let additionalProps = {};

    //if (config.render) {
    //   content = config.render({
    //     key: key,
    //     messageDetails: itemDetails
    //   });
    // //}

    let textAlign = "left";

    // if (itemDetails.type === PARTICIPANT_MESSAGE) {
    //   config = Object.assign({}, config, transcriptConfig.participantMessageConfig);
    //   additionalProps = {
    //     mediaOperations: {
    //       addMessage: this.props.addMessage,
    //       downloadAttachment: this.props.downloadAttachment
    //     },
    //     textInputRef: this.props.textInputRef,
    //     isLatestMessage
    //   }
    // } else if (itemDetails.type === ATTACHMENT_MESSAGE) {
    //   config = Object.assign({}, config, transcriptConfig.attachmentMessageConfig);
    //   additionalProps = {
    //     mediaOperations: {
    //       downloadAttachment: this.props.downloadAttachment
    //     }
    //   }
    // } else if (modelUtils.isRecognizedEvent(itemDetails.content.type)) {
    //   config = Object.assign({}, config, transcriptConfig.systemMessageConfig);
    //   textAlign = "center";
    // } else {
    //   return <React.Fragment />;
    // }
    // if (!content && config && config.render) {
    //   content = config.render({
    //     key: key,
    //     messageDetails: itemDetails,
    //     ...additionalProps
    //   });
    // }

    return (
      <MessageBox key={key} textAlign={textAlign}>
        {/* {config.isHTML ? renderHTML(content) : content} */}
        <ParticipantMessage messageDetails={itemDetails}  />
      </MessageBox>
    );
  };

  render() {
    const lastMessageIndex = this.props.transcript.length - 1;

    return (
      <TranscriptWrapper
        contactId={this.props.contactId}
        type={this.props.contactStatus}
        loadPreviousTranscript={this.loadTranscript}
        lastSentMessageId={null}
      >
            <TranscriptBody>
              {this.props.transcript.map((item, idx) => this.renderMessage(item, idx === lastMessageIndex))}
            </TranscriptBody>
      </TranscriptWrapper>
    );
  }
}