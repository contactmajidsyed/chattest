import * as React from "react";
import styled from "styled-components";
import PT from "prop-types";
import { Button } from "connect-core";


const Actions = styled.div`
  background: ${props => props.theme.palette.dustyGray};
  height: 85px;
`;

const FooterWrapper = styled.div`
  order: 4;
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

const ActionButton = styled(Button)`
  margin: ${props => props.theme.spacing.small};
  width: ${props => (props.col ? 100 / props.col - 7 + "%" : "")};
  
`;

// function createMarkup(content) {
//   return { __html: content };
// }

export default class ChatErrorActionBar extends React.Component {
  static propTypes = {
    onClose: PT.func,
    footerConfig: PT.object
  };

  static defaultProps = {
    onClose: () => { },
    footerConfig: {}
  };

  render() {
    const {
      onClose,
      // footerConfig
    } = this.props;

    // if (footerConfig.render) {
    //   const content = footerConfig.render(this.props);
    //   return footerConfig.isHTML ? <FooterWrapper dangerouslySetInnerHTML={createMarkup(content)} />
    //     : <FooterWrapper>{content}</FooterWrapper>
    // }

    return (
      <FooterWrapper>
        <Actions>
          <ButtonWrapper>
              <React.Fragment>
                <ActionButton
                  col="2"
                  type="tertiary"
                  onClick={onClose}
                >
                  Close
                </ActionButton>
              </React.Fragment>
          </ButtonWrapper>
        </Actions>
      </FooterWrapper>
    );
  }
}
