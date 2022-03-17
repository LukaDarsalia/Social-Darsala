import React from "react";
import Navbar from "./Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import UserUpBody from "./UserUpBody";
import MyBody from "./MyBody";
import Box from "@material-ui/core/Box";

function Me(props) {
  let theme = null;
  if (props.dark === "light") {
    theme = createMuiTheme({
      palette: {
        primary: {
          main: "#82b1ff",
        },
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
        background: {
          default: "rgb(0, 20, 40)",
          paper: "rgb(10, 25, 41)",
        },
        divider: "rgb(10, 25, 41)",
      },
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Navbar dark={props.dark} me={props.me} socket={props.socket}/>
        <UserUpBody name={props.me.name + "(Me)"} dark={props.dark} />
        <MyBody dark={props.dark} me={props.me} socket={props.socket}/>
      </Box>
    </ThemeProvider>
  );
}

export default Me;
