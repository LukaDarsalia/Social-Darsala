import React from "react";
import Navbar from "./Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import ChatBody from "./ChatBody";

export default function Chat(props){
    let theme = null;
  if (props.dark === "light") {
    theme = createMuiTheme({
      palette: {
        type: props.dark,
        background: {
          default: "#dcdcdc",
        },
      },
    });
  } else {
    theme = createMuiTheme({
      palette: {
        type: props.dark,
      },
    });
  }
    return(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Navbar dark={props.dark} me={props.me} socket={props.socket}/>
        <ChatBody me={props.me} dark={props.dark} socket={props.socket}/>
    </ThemeProvider>
    );
}