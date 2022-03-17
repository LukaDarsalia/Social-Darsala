import React from "react";
import Navbar from "./Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CreateBlogBody from "./CreateBlogBody";

export default function CreateBlog(props) {
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar dark={props.dark} socket={props.socket} me={props.me}/>
        <CreateBlogBody me={props.me}/>
      </div>
    </ThemeProvider>
  );
}
