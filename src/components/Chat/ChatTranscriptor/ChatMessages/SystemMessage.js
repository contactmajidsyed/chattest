import React from "react";
import PT from "prop-types";
import { Text } from "connect-core";
import { ContentType, PARTICIPANT_TYPES } from "../../datamodel/Model";
// import agentAudio from "../../../../assets/sounds/agent-joined.wav";

export class SystemMessage extends React.PureComponent {
  static propTypes = {
    messageDetails: PT.object.isRequired
  };

  static defaultProps = {};

  getMessageText = () => {
    console.log("SystemMessage getMessageText");
    console.log(this.props);
    let name = "";
    switch (this.props.messageDetails.content.type) {
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_JOINED:
        name = this.props.messageDetails.displayName;
        let message = ""
        if (this.props.messageDetails.participantRole === PARTICIPANT_TYPES.AGENT) {
          let role = name.split(" ").pop();
          message = `You've been connected to a ` + role.toLowerCase();
        }
        return message;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT:
        name = this.props.messageDetails.displayName;
        return name + " has left the chat.";
      case ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED:
        return "Your chat session has ended.";
      case ContentType.EVENT_CONTENT_TYPE.TRANSFER_FAILED:
        return "Chat transfer failed.";
      case ContentType.EVENT_CONTENT_TYPE.TRANSFER_SUCCEEDED:
        return "Chat transfer succeeded."
      default:
        return "";
    }
  };

  // playSound() {
  //   var audio = new Audio(agentAudio);
  //   audio.play();
  // }

  render() {
    return <Text type="h5"> {this.getMessageText()}</Text>;
  }
}