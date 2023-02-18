import React from "react";
import PT from "prop-types";
import Box from '@mui/material/Box';
import { Button } from 'connect-core';
import Modal from '@mui/material/Modal';
import styled from "styled-components";


EndChatModal.propTypes = {
  show: PT.bool,
  message: PT.string

};
const ActionButton = styled(Button)`
  margin: ${props => props.theme.spacing.medium};
  width: ${props => (props.col ? 100 / props.col - 7 + "%" : "")};
  font-family: "Amazon Ember Display Bold";
  
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 100%;
  align-items: center;
  > button {
    min-width: 85px;
    margin: ${props => props.theme.spacing.mini};
    font-weight: bold;
    height: 45px;
    border: 1px solid #D7D7D7;
  }
  > button :hover {
    min-width: 85px;
    margin: ${props => props.theme.spacing.mini};
    font-weight: bold;
    height: 45px;
    border: 1px solid #D7D7D7;
  }
`;

const ModalDescription = styled.p`
  margin: 5px;
  font-family: 'AMAZON EMBER';
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  text-align: center;
`;
const END_CHAT_WARNING = `Confirm you'd like to close this chat session`;

export default function EndChatModal({ show, onEndChat, onClose }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    outline: 'none',
    padding: '20px',
    borderRadius: 2,
  };


  return (
    <React.Fragment>

      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalDescription id="modal-modal-description">
            {END_CHAT_WARNING}
          </ModalDescription>
          <ButtonWrapper>
            <ActionButton
              col="2"
              type="secondary"
              onClick={onEndChat}
            >
              Close chat
            </ActionButton>
            <ActionButton
              col="2"
              type="primary"
              onClick={onClose}
            >
              Go back
            </ActionButton>
          </ButtonWrapper>
        </Box>

      </Modal>


    </React.Fragment>

  );
}