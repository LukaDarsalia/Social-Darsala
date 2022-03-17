import React from "react";
import Navbar from "./mainComponents/Navbar";
import Body from "./mainComponents/Body";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";


function Main(props) {
  let theme = null;
  
  if (props.dark === "light") {
    theme = createMuiTheme({
      palette: {
        primary: {
          main: '#82b1ff',
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
      <div>
        <Navbar dark={props.dark} me={props.me} socket={props.socket}/>
        <Body
          dark={props.dark}
          me={props.me}
          socket={props.socket}
        />
      </div>
    </ThemeProvider>
  );
}

export default Main;
