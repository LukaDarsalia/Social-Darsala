import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";

export default function ChatHead(props) {
  let color = "";
  props.dark === "dark" ? (color = "#026290") : (color = "#D93A34");
  const [active, setActive] = React.useState(false);
  const useStyles = makeStyles((theme) => ({
    but: {
      marginTop: "10px",
      width: "100%",
      height: "60px",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    card: {
      display: "flex",
      width: "100%",
      height: "60px",
    },
    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: color,
    },
    header: {
      textAlign: "start",
    },
  }));
  const classes = useStyles();
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
          paper: "rgb(0, 27, 53)",
        },
        divider: "rgb(10, 25, 41)",
      },
    });
  }

  React.useEffect(() => {
    props.socket.emit("activeRequest", { id: props.id });
    
  }, []);
  React.useEffect(() => {
    if(window.location.pathname==="/chat"){
      props.socket.on("activeResponse", (msg) => {
        setActive(msg.active);
      });
    }
    
    
  }, []);
  
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton className={classes.but} onClick={props.clicker}>
          {props.cond === true ? (
            <Card className={classes.card}>
              <CardHeader
                className={classes.header}
                avatar={
                  <Box>
                    {active === true && (
                      <Box
                        style={{
                          position: "absolute",
                          width: "10px",
                          height: "10px",
                          background: "#08ff08",
                          borderRadius: "50%",
                          bottom: "8px",
                          marginLeft: "27px",
                          zIndex: 2,
                        }}
                      ></Box>
                    )}
                    <Avatar className={classes.avatar}>{props.name[0]}</Avatar>
                  </Box>
                }
                title={props.name}
                subheader={
                  props.lastText.length < 25
                    ? props.lastText
                    : props.lastText.substr(0, 25) + " ..."
                }
              />
            </Card>
          ) : (
            <Card style={{ color: "red" }} className={classes.card}>
              <CardHeader
                className={classes.header}
                avatar={
                  <Avatar className={classes.avatar}>{props.name[0]}</Avatar>
                }
                title={props.name}
                subheader={
                  props.lastText.length < 25
                    ? props.lastText
                    : props.lastText.substr(0, 25) + " ..."
                }
              />
            </Card>
          )}
        </IconButton>
      </ThemeProvider>
    </React.Fragment>
  );
}
