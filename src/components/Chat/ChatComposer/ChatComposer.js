

import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";
import PT from "prop-types";
import { CONTACT_STATUS, KEYBOARD_KEY_CONSTANTS } from "connect-constants";
import TextareaAutosize from 'react-textarea-autosize';
import PHIModal from "../PHIModal";
import { ATTACHMENT_ACCEPT_CONTENT_TYPES } from "../datamodel/Model";
// import { isIdentifier, isJSDocCallbackTag } from 'typescript';

const ChatComposerWrapper = styled.div`
  display: flex;
  order: 3;
  background: ${props => props.theme.palette.white};
  border: 0.5px solid ${props => props.theme.palette.lightGray};
  border-left: 0;
  border-right: 0;
`;

const PaperClipContainer = styled.div`
  cursor: pointer;
  height: auto;
  vertical-align: top;
  
  button {
    height: 100%;
    width: 100%;
  }
  
  label {
    align-items: center;
    display: flex;
    cursor: pointer;
    font-size: 0;
    height: 100%;
    padding-left: ${props => props.theme.spacing.mini};
    padding-right: ${props => props.theme.spacing.mini};
    margin-bottom: 0;
  }
  
  input {
    display: none;
  }
  
  &+[role='textbox']{
    padding-left: 0;
  }
`;

const IconButton = styled.div`    
    background-color: transparent;
    border: 1px solid transparent;
    position: relative;
    padding: 0;
    margin: 0;
    height:100%;
`;

const AttachmentContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.chatTranscriptor.outgoingMsgBg};
  border-radius: 5px;
  margin: 5px;
  padding: ${props => props.theme.spacing.mini};
  min-width: 0;
  
  &>div {
     width: 100%;
     
     span {
       overflow-wrap: break-word;
     }
   
     button {
       align-items: center;
       display: inline-flex;
       cursor: pointer;
       margin-left: 5px;
     }
  }
  
  &+div{
    padding-left: 0;
  }
`;

const TextInput = styled(TextareaAutosize)`
  flex: 1;
  outline: none;
  user-select: text;
  word-break: break-word;
  font-family: inherit;
  padding: ${props => props.theme.spacing.small};
  padding-left: 0;
  margin-left: ${props => props.theme.spacing.small};
  max-height: 80px;
  line-height: 1.5rem;
  overflow: auto;
  min-height: 39px;
  z-index: 2;
  resize: none; 
  letter-spacing: ${(props) => props.theme.globals.letterSpacing};
  font-size: ${props => props.theme.fontsSize.regular};
  border: none;

  &::placeholder {
    color: ${props => props.theme.palette.mediumGray};
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const PaperClipIcon = styled.div`
  display: flex;
  font-size: 0;
    
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CloseIcon = styled.div`
  display: flex;
  font-size: 0;
  svg {
    width: ${({ theme }) => theme.fontsSize.mini};
	height: ${({ theme }) => theme.fontsSize.mini};
  }
`;

ChatComposer.propTypes = {
  addMessage: PT.func,
  addAttachment: PT.func,
  onTyping: PT.func,
  contactId: PT.string.isRequired,
  contactStatus: PT.string.isRequired,
  onTypingValidityTime: PT.number,
  composerConfig: PT.object,
  modalOpen: PT.bool,
  onOpen: PT.func,
  onClose: PT.func,
};

ChatComposer.defaultProps = {
  onTypingValidityTime: 10 * 1000
};

export default function ChatComposer({ addMessage, addAttachment, onTyping, contactId, contactStatus, onTypingValidityTime, textInputRef, composerConfig, modalOpen, onClose, onOpen }) {
  const [message, setMessage] = useState("");
  const [phiMessage, setPhiMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);


  useLayoutEffect(() => {
    if (!textInputRef || !textInputRef.current || !textInputRef.current.focus) {
      return;
    }
    textInputRef.current.focus();
  }, [attachment]);

  function hasSameContent(event) {
    return event.target.innerText === message;
  }

  function onInput(event) {
    if (!event.shiftKey && event.key === KEYBOARD_KEY_CONSTANTS.ENTER) {
      event.preventDefault();
      throttledOnTyping.cancel();
      setMessage("");
      sendTextMessage(event.target.value);

      if (attachment) {
        sendAttachment();
        clearFileInput();
      }

      return false;
    } else {
      if (!hasSameContent(event)) {
        throttledOnTyping();
      }
      setMessage(event.target.value);
    }

    if (event.key === KEYBOARD_KEY_CONSTANTS.DELETE || event.key === KEYBOARD_KEY_CONSTANTS.BACKSPACE) {
      if (attachment && message === "") {
        event.preventDefault();
        clearFileInput();
        return;
      }
    }
  }

  const throttledOnTyping = useCallback(
    throttle(() => {
      onTyping().then(() => {
        console.log("CCP", "ChatComposer", "On typing event sent successfully");
      });
    }, onTypingValidityTime),
    [onTypingValidityTime]
  );

  function sendTextMessage(text) {
    if (text.trim()) {
      if (!isCreditCarInfo(text)) {
        addMessage(contactId, { text });
      }
      else {
        let redactedTxt
        setPhiMessage(text)
        redactedTxt = text.replace(/[0-9]/g, '*');
        setMessage(redactedTxt);
        setOpen(true)
      }
    }
  }

  function sendAnyway() {
    if (phiMessage.trim()) {
      setOpen(false);
      addMessage(contactId, { text: phiMessage });
      setMessage("");
      setPhiMessage("");
    }
  }
  function closeModal() {
    setOpen(false);
  }


  function checkLuhn(cardNo) {
    var s = 0;
    var doubleDigit = false;
    for (var i = cardNo.length - 1; i >= 0; i--) {
      var digit = +cardNo[i];
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9)
          digit -= 9;
      }
      s += digit;
      doubleDigit = !doubleDigit;
    }
    return s % 10 === 0;
  }

  function isCreditCarInfo(message) {
    var ccNum = message.replace(/[^0-9\.]/g, '');
    // if(isVisa(no) || isMaster(no) || isAmex(no) || isDiscover(no) || isDiner(no) || isJcb(no) || isHba(no)){
    //   return true;
    // } 
    // return false;
    // return (no && checkLuhn(no) && no.length === 16
    //  && (no[0] === 4 || no[0] === 5 && no[1] >= 1 && no[1] <= 5 || (no.indexOf("6011") === 0 || no.indexOf("65") === 0)) 
    //  || no.length === 15 
    //  && (no.indexOf("34") === 0 || no.indexOf("37") === 0) 
    //  || no.length === 13 && no[0] === 4)

    // var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    // var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    // var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    // var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    var ccRegEx = /(^4[0-9]{12}(?:[0-9]{3})?$)|(^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$)|(3[47][0-9]{13})|(^3(?:0[0-5]|[68][0-9])[0-9]{11}$)|(^6(?:011|5[0-9]{2})[0-9]{12}$)|(^(?:2131|1800|35\d{3})\d{11}$)/;
    if (ccRegEx.test(ccNum)) {
      return true;
    }
    return false;
  }

  function onFileInput(e) {
    const file = e.target.files[0];
    setAttachment(file);
  }

  function clearFileInput() {
    setAttachment(null);
    fileInputRef.current.value = null;
  }

  function sendAttachment() {
    addAttachment(contactId, attachment);
  }

  const ariaLabel = "Type your message";
  const placeholder = attachment == null ? ariaLabel : "";

  return (
    <ChatComposerWrapper>
      {(contactStatus === CONTACT_STATUS.CONNECTED) && (
        <React.Fragment>
          {composerConfig.attachmentsEnabled &&
            <PaperClipContainer>
              <IconButton aria-label={"Attach a file"}>
                <label htmlFor={`customer-chat-file-select-${contactId}`}>
                  <PaperClipIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                    </svg>
                  </PaperClipIcon>
                  <input ref={fileInputRef} type="file" id={`customer-chat-file-select-${contactId}`} data-testid={`customer-chat-file-select`}
                    accept={ATTACHMENT_ACCEPT_CONTENT_TYPES.join(',')}
                    onChange={onFileInput} aria-label={"Attach a file"} tabIndex={-1} />
                </label>
              </IconButton>
            </PaperClipContainer>}
          {(attachment != null) && (
            <AttachmentContainer>
              <div>
                <span>{attachment.name}</span>
                <IconButton onClick={clearFileInput} aria-label={"Remove attachment"}>
                  <CloseIcon>
                    <svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M13 1.3L11.7 0 6.5 5.2 1.3 0 0 1.3l5.2 5.2L0 11.7 1.3 13l5.2-5.2 5.2 5.2 1.3-1.3-5.2-5.2z" fillRule="evenodd" />
                    </svg>
                  </CloseIcon>
                </IconButton>
              </div>
            </AttachmentContainer>
          )}
          <TextInput
            data-testid={`customer-chat-text-input`}
            ref={textInputRef}
            value={message}
            onInput={onInput}
            onKeyPress={onInput}
            onKeyDown={onInput}
            aria-label={ariaLabel}
            placeholder={placeholder}
            tabIndex="0"
            spellcheck="false"
          />
          <PHIModal show={open} onSend={sendAnyway} onClose={closeModal} />
        </React.Fragment>
      )}
    </ChatComposerWrapper>
  );
}