

import React, { PureComponent } from "react";
import styled from "styled-components";
import PT from "prop-types";
import Linkify from "react-linkify";
import { ATTACHMENT_MESSAGE, AttachmentStatus, ContentType, Status, Direction } from "../../datamodel/Model";
import { Icon, TypingLoader } from "connect-core";
import { InteractiveMessage } from "./InteractiveMessage";
import {
  PARTICIPANT_TITLES,
  PARTICIPANT_TYPES
} from "../../datamodel/Model";

export const MessageBox = styled.div`
  padding: ${({ theme }) => theme.spacing.mini}
    ${({ theme }) => theme.spacing.base};
  word-break: break-word;
  white-space: pre-line;
  overflow: auto;
  text-align: ${props => props.textAlign};
`;
const Header = styled.div`
  overflow: auto;
`;
Header.Sender = styled.div`
  float: ${props => props.direction === Direction.Incoming ? "left" : "right"};
  // margin-left: ${props => props.direction === Direction.Outgoing ? "calc(3.75rem)" : ""};
  max-width: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Amazon Ember';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #323E4A;
`;
Header.Status = styled.div`
  float: right;
`;
const Body = styled.div`
  display: flex;
  justify-content: ${props =>
    props.direction === Direction.Outgoing ? "flex-end" : ""};
`;
Body.Message = styled.div`
  ${props =>
    props.direction === Direction.Outgoing
      ? props.theme.chatTranscriptor.outgoingMsg
      : props.theme.chatTranscriptor.incomingMsg};

  ${props =>
    props.messageStyle ? props.messageStyle : ""};

  padding: ${props => props.removePadding ? 0 : props.theme.spacing.base};
  margin-top: ${props => props.theme.spacing.mini};
  border-radius: 5px;
  position: relative;
  max-width: calc(100% - 3.4375rem);
  display: flex;
  font-family: "Amazon Ember";
  font-style: normal;
  &:after{
    display: ${props => props.hideDirectionArrow ? "none" : "block"};
    ${props =>
    props.direction === Direction.Outgoing
      ? `
      content: " ";
      position: absolute;
      right: -6px;
      bottom: 4px;
      border-radius: 2px;
      border-left: 12px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 9px solid ${props.theme.chatTranscriptor.outgoingMsgBg};
      font-family: 'Amazon Ember';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #51606D;
    `
      : `
      content: " ";
      position: absolute;
      left: -6px;
      bottom: 4px;
      border-radius: 2px;
      border-left: 10px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 9px solid ${props.theme.chatTranscriptor.incomingMsgBg};`}
  }
`;


Body.Status = styled.div`

${props =>
    props.direction === Direction.Outgoing
      ? props.theme.OutgoingStatus
      : props.theme.IncomingStatus};
    `;
const ErrorText = styled.div`
  color: ${({ theme }) => theme.palette.red};
  display: flex;
  > img {
    margin-right: ${({ theme }) => theme.spacing.mini};
  }
`;
const StatusText = styled.span`
  color: ${({ theme }) => theme.globals.textSecondaryColor};
  padding-right: ${({ theme }) => theme.spacing.mini};
`;

const TransportErrorMessage = styled.div`
  margin-left: ${props => props.theme.chatTranscriptor.msgStatusWidth};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.micro};
  
  span {
    color: ${({ theme }) => theme.palette.red};
  }  
`;

TransportErrorMessage.RetryButton = styled.a`
  margin-left: ${({ theme }) => theme.spacing.micro};
`;


export class ParticipantMessage extends PureComponent {
  static propTypes = {
    messageDetails: PT.object.isRequired,
    prevMessageDetails: PT.object,
    incomingMsgStyle: PT.object,
    outgoingMsgStyle: PT.object,
    mediaOperations: PT.object,
    isLatestMessage: PT.bool
  };

  timestampToDisplayable(timestamp) {
    const d = new Date(0);
    d.setUTCSeconds(timestamp);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
  }

  renderHeader(displayName, role, direction) {
    if (role === PARTICIPANT_TYPES.SYSTEM) {
      displayName = PARTICIPANT_TITLES.SYSTEM
    }
    return (
      <React.Fragment>
        <Header.Sender direction={direction}>{displayName}</Header.Sender>
      </React.Fragment>
    );
  }

  renderTime() {
    const transportDetails = this.props.messageDetails.transportDetails;
    // const isOutgoingMsg = this.props.messageDetails.transportDetails.direction === Direction.Outgoing;
    let transportStatusElement = <React.Fragment />; 
    switch (transportDetails.status) {
      case Status.Sending:
        transportStatusElement = (
          <React.Fragment>
            <StatusText>
              <span>Sending</span>
            </StatusText>
          </React.Fragment>
        );
        break;
      case Status.SendSuccess:
        transportStatusElement = (
          <React.Fragment>
            {this.timestampToDisplayable(transportDetails.sentTime)}
          </React.Fragment>
        );
        break;
      case Status.SendFailed:
        transportStatusElement = (
          <ErrorText>
            <Icon />
            <span>
              Failed to send!
            </span>
          </ErrorText>
        );
        break;
      default:
        transportStatusElement = <React.Fragment />;
    }
    return (
      <React.Fragment>
        <Header.Status>{transportStatusElement}</Header.Status>
      </React.Fragment>
    );
  }

  render() {
    let { direction, error } = this.props.messageDetails.transportDetails;
    const messageStyle = direction === Direction.Outgoing ? this.props.outgoingMsgStyle : this.props.incomingMsgStyle;

    //Hack to simulate ChatJS response with attachment content types
    const bodyStyleConfig = {};
    if (this.props.isLatestMessage &&
      this.props.messageDetails.content.type === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE) {
      bodyStyleConfig.hideDirectionArrow = true;
      bodyStyleConfig.removePadding = true;
    }
    let content, contentType;
    let displayName = this.props.messageDetails.displayName;
    let prevRole = this.props.prevMessageDetails.participantRole;
    let prevType = this.props.prevMessageDetails.type;
    let role = this.props.messageDetails.participantRole;
    let type = this.props.messageDetails.type;
    let displayHeader = true;

    if (role === prevRole) {
      if (type === prevType){
        displayHeader = false;
      }
    }
    let dt = this.props.messageDetails.transportDetails.direction;
    if (this.props.messageDetails.type === ATTACHMENT_MESSAGE) {
      //Use Attachments data as content if available
      //If an attachment message does not have this data, it means the upload was rejected
      if (this.props.messageDetails.Attachments && this.props.messageDetails.Attachments.length > 0) {
        content = this.props.messageDetails.Attachments[0];
        contentType = content.ContentType;
      } else {
        content = {
          AttachmentName: this.props.messageDetails.content.name
        };
        contentType = this.props.messageDetails.content.type
      }
    } else {
      content = this.props.messageDetails.content.data;
      contentType = this.props.messageDetails.content.type
    }

    return (
      <React.Fragment>
        { displayHeader === true && <Header>{this.renderHeader(displayName, role, dt)}</Header> }
        <Body direction={direction}>
          {direction === Direction.Outgoing && <Body.Status direction={direction}> {this.renderTime()}</Body.Status>}
          <Body.Message direction={direction} messageStyle={messageStyle} {...bodyStyleConfig}>
            {this.renderContent(content, contentType)}
          </Body.Message>
          {direction === Direction.Incoming && <Body.Status direction={direction}> {this.renderTime()}</Body.Status>}
        </Body>
        {error && this.renderTransportError(error)}
      </React.Fragment>
    );
  }

  renderContent(content, contentType) {
    if (this.props.messageDetails.type === ATTACHMENT_MESSAGE) {
      return <AttachmentMessage content={content}
        downloadAttachment={this.props.mediaOperations.downloadAttachment} />;
    }
    let textContent = content;
    if (contentType === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE) {
      const { data, templateType } = JSON.parse(content);
      if (this.props.isLatestMessage) {
        return <InteractiveMessage content={data.content} templateType={templateType}
          addMessage={this.props.mediaOperations.addMessage}
          textInputRef={this.props.textInputRef} />
      }
      textContent = data.content.title;
    }
    return <PlainTextMessage content={textContent} />;
  }

  renderTransportError(error) {
    if (!error || !error.message) {
      return null;
    }
    return (
      <TransportErrorMessage>
        <span>{error.message}</span>
        {error.retry && this.renderRetryButton(error.retry)}
      </TransportErrorMessage>
    );
  }

  renderRetryButton(callback) {
    const onRetry = (e) => {
      e.preventDefault();
      callback();
    };

    return (
      <TransportErrorMessage.RetryButton href={'Retry'} tabIndex={0} onClick={onRetry} onKeyPress={onRetry}>
        Retry
      </TransportErrorMessage.RetryButton>
    );
  }
}

class PlainTextMessage extends PureComponent {
  render() {
    return (
      <Linkify properties={{ target: "_blank" }}>{this.props.content}</Linkify>
    );
  }
}

const ParticipantTypingBox = styled(MessageBox)`
  > ${Body.Message}{
    display: inline-block;
    float: ${props =>
    props.direction === Direction.Outgoing ? "right" : "left"}
`;

export class ParticipantTyping extends PureComponent {
  render() {
    return (
      <ParticipantTypingBox direction={this.props.direction}>
        <Body.Message direction={this.props.direction}>
          <TypingLoader
            color={
              this.props.direction === Direction.Outgoing ? "#fff" : "#000"
            }
          />
        </Body.Message>
      </ParticipantTypingBox>
    );
  }
}

class AttachmentMessage extends PureComponent {
  downloadAttachment = (e) => {
    e.preventDefault();
    if (!this.props.content.AttachmentId) { return; }
    this.props.downloadAttachment(this.props.content.AttachmentId)
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", this.props.content.AttachmentName);
        link.click();
      });
  }

  renderContent() {
    if (this.props.content.Status === AttachmentStatus.APPROVED) {
      return <a href={this.props.content.AttachmentName} onClick={this.downloadAttachment}
        onKeyPress={this.downloadAttachment}>{this.props.content.AttachmentName}</a>
    }
    return this.props.content.AttachmentName;
  }

  render() {
    if (!this.props.content) { return; }

    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}