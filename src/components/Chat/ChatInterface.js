/**
 * Simple utitlity for for Event subscription
 */
import EventBus from "./eventbus"

class ChatInterface {

  // clientConfig = {
  //   contactFlowId: "",
  //   instanceId: "",
  //   region: "",
  //   stage: "prod",
  //   contactAttributes: {},
  //   featurePermissions: {}
  // }

  clientConfig = {
    startChatResult: {
      ContactId: "",
      ParticipantId: "",
      ParticipantToken: "",
    },
    stage: "prod",
    previousContactId: "",
    region: "",
    name: "",
    agentJoinedAudio: "",
  }

  initiateChat(input, success, failure) {
    console.log("int initiachat chatinyerface.js");

    let chatInput = Object.assign({}, this.clientConfig, input);
    console.log(chatInput);
    EventBus.trigger("initChat", chatInput, success, failure);
  }
}


window.connect = window.connect || {};
window.connect.ChatInterface = window.connect.ChatInterface || new ChatInterface();


window.addEventListener("message", function (data) {
  if (data.initChat) {
    window.connect.ChatInterface.initiateChat(data);
  }
})

