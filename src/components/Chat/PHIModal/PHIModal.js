import React from "react";
import PT from "prop-types";
import Box from '@mui/material/Box';
import { Button } from 'connect-core';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from "styled-components";


PHIModal.propTypes = {
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
    border: none;
  }
  > button :hover {
    min-width: 85px;
    margin: ${props => props.theme.spacing.mini};
    font-weight: bold;
    height: 45px;
    border: none;
  }
`;

const ModalDescription = styled.p`
  margin: 5px;
  font-family: 'AMAZON EMBER';
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.00938em;
`;
const PHI_WARNING = `It looks like you're trying to send your credit or debit card number. To protect your privacy and security, this message will not be sent to the agent you're chatting with. We've also removed your card's numbers from your message.`;

export default function PHIModal({ show, onSend, onClose }) {
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
            {PHI_WARNING}
          </ModalDescription>
          <ButtonWrapper>
            <ActionButton
              col="2"
              type="secondary"
              onClick={onClose}
            >
              Close
            </ActionButton>
          </ButtonWrapper>
        </Box>

      </Modal>


    </React.Fragment>

  );
}