import React from "react";
import Navbar from "./Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import UserUpBody from "./UserUpBody";
import UsersBody from "./UsersBody";

function User(props) {
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
  let name = "";
  let pathname = window.location.pathname.substring(1);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar dark={props.dark} me={props.me} socket={props.socket}/>
        <UserUpBody name={props.userName} dark={props.dark} />
        <UsersBody
          name={props.userName}
          dark={props.dark}
          me={props.me}
          id={pathname}
          socket={props.socket}
        />
      </div>
    </ThemeProvider>
  );
}

export default User;
