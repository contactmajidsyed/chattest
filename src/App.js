import React from "react";
import { ThemeProvider } from "./theme";
import styled from "styled-components";

import ChatContainer from "./components/Chat/ChatContainer";

import defaultTheme from './theme/defaultTheme';


const Page = styled.div`
  width: ${props => props.theme.screen.small.width}px;
  height: ${props => props.theme.screen.small.height}px;

  font-family: ${props => props.theme.fonts.regular};

  margin: -8px;
  border-collapse: collapse;
  box-shadow: 0px 2px 3px ${props => props.theme.palette.alto};

  box-sizing: border-box;

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;


const AppProvider = props => {
  return (
    <ThemeProvider theme={Object.assign({}, defaultTheme, props.themeConfig)}>
      {props.children}
    </ThemeProvider>
  );
};

App.defaultProps = {
  baseCssClass: "connect-customer-interface"
};

function App({ baseCssClass, ...props }) {
  return (
    <AppProvider themeConfig={props.themeConfig || {}}>
      <Page className={baseCssClass}>
        <ChatContainer {...props} />
      </Page>
    </AppProvider>
  );
}

export default App;
