import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import "emoji-mart/css/emoji-mart.css";
import axios from "axios";
import SingleChat from "./SingleChat";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import ChatTextBottom from "./ChatTextbottom";

export default function ChatText(props) {
  const [open, setOpen] = React.useState(true);
  function useStateCallback(initialState) {
    const [state, setState] = React.useState(initialState);
    const cbRef = React.useRef(null); // init mutable ref container for callbacks

    const setStateCallback = React.useCallback((state, cb) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(state);
    }, []); // keep object reference stable, exactly like `useState`

    React.useEffect(() => {
      // cb.current is `null` on initial render,
      // so we only invoke callback on state *updates*
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null; // reset callback after execution
      }
    }, [state]);

    return [state, setStateCallback];
  }
  let color = "";
  const [chats, setChats] = useStateCallback([]);
  const [full, setFull] = React.useState(null);
  const [counter, setCounter] = React.useState(2);
  let chatsDva = [];
  
  props.dark === "dark" ? (color = "#026290") : (color = "#D93A34");
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    Name: {
      display: "flex",
      height: "max-content",
      paddingTop: "12px",
      fontSize: "1.4rem",
      filter: "contrast(0.75)",
      [theme.breakpoints.up(450)]: {
        fontSize: "1.8rem",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "2.5rem",
      },
    },
    userAvatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: color,
      justifyContent: "center",
      width: "60px",
      height: "60px",
      fontSize: "1.7rem",
      [theme.breakpoints.up(450)]: {
        width: "70px",
        height: "70px",
        fontSize: "2rem",
      },
      [theme.breakpoints.up("sm")]: {
        width: "100px",
        height: "100px",
        fontSize: "3.5rem",
      },
    },
    user: {
      display: "flex",
      marginTop: "1rem",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
    },
    userAvatarBox: {
      display: "flex",
      alignItems: "center",
    },
    inputer: {
      width: "40%",
      [theme.breakpoints.up(300)]: {
        width: "50%",
      },
      [theme.breakpoints.up(350)]: {
        width: "58%",
      },
      [theme.breakpoints.up(415)]: {
        width: "65%",
      },
      [theme.breakpoints.up(450)]: {
        width: "68%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "74%",
      },
      [theme.breakpoints.up(800)]: {
        width: "75%",
      },
      [theme.breakpoints.up(830)]: {
        width: "78%",
      },
      [theme.breakpoints.up(872)]: {
        width: "83%",
      },
      [theme.breakpoints.up(879)]: {
        width: "85%",
      },
    },
    page: {
      height: "calc(100vh - 100px)",
      overflow: "auto",
    },
  }));
  const classes = useStyles();
  let theme = null;
  if (props.dark === "light") {
    theme = createMuiTheme({
      palette: {
        type: props.dark,
        background: {
          default: "#fff",
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

  React.useEffect(() => {
    const option = {
      method: "post",
      url: "api/wholeChat",
      data: { id: props.user, cond: true },
      headers: { "Content-Type": "application/json" },
    };
    axios(option).then((res) => {
      setOpen(false);
      res.data === "" && setFull(true);
      if (res.data.length !== chatsDva.length) {
        setChats(res.data.text, () => {
          chatsDva = res.data.text;
          document
            .getElementById("pa")
            .scrollTo(0, document.getElementById("pa").scrollHeight);
          setFull(res.data.full);
        });
      }
    });
  }, []);

  React.useEffect(() => {
    document.getElementById("pa").onscroll = function () {
      if (full === false) {
        if (document.getElementById("pa").scrollTop === 0) {
          setOpen(true);
          props.socket.emit("newChat", {
            counter: counter,
            id: window.location.pathname.split("-")[1],
            myId: props.me.id,
          });
        }
      }
    };
  });

  React.useEffect(() => {
    props.socket.on("getNewChat", (msg) => {
      var prevHeight = document.getElementById("pa").scrollHeight;
      setChats(
        (prev) => [...msg.text, ...prev],
        () => {
          document
            .getElementById("pa")
            .scrollTo(
              0,
              document.getElementById("pa").scrollHeight - prevHeight
            );
          setOpen(false);
          setCounter((prev) => prev + 1);
          setFull(msg.full);
        }
      );
    });
  }, []);

  React.useEffect(() => {
    props.socket.on("sendTextServer", (msg) => {
      if ("img" in msg) {
        msg.img = { data: msg.img, contentType: "image/png" };
        setChats((prev) => [...prev, msg]);
        document
          .getElementById("pa")
          .scrollTo(0, document.getElementById("pa").scrollHeight);
      } else {
        setChats((prev) => [...prev, msg]);
        document
          .getElementById("pa")
          .scrollTo(0, document.getElementById("pa").scrollHeight);
      }
    });
  }, []);
  React.useEffect(() => {
    props.socket.on("seen", (msg) => {
      if (msg.seen === false) {
        const options = {
          method: "post",
          url: "api/seen",
          data: { id: msg.id },
          headers: { "Content-Type": "application/json" },
        };
        axios(options);
      }
    });
  }, []);
  
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className={classes.page} id="pa">
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
          {full === true && (
            <Box className={classes.user}>
              <Box className={classes.userAvatarBox}>
                <Avatar className={classes.userAvatar}>{props.user.name[0]}</Avatar>
              </Box>
              <Typography className={classes.Name}>{props.user.name}</Typography>
            </Box>
          )}

          {full === false && (
            <Box>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Skeleton
                  variant="rect"
                  width={300}
                  height={80}
                  style={{
                    margin: "2px 20px",
                    borderRadius: "20px",
                    maxWidth: "50%",
                  }}
                />
              </Box>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Skeleton
                  variant="rect"
                  width={300}
                  height={50}
                  style={{
                    margin: "2px 20px",
                    borderRadius: "20px",
                    maxWidth: "50%",
                  }}
                />
              </Box>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Skeleton
                  variant="rect"
                  width={400}
                  height={50}
                  style={{
                    margin: "2px 20px",
                    borderRadius: "20px",
                    maxWidth: "50%",
                  }}
                />
              </Box>
            </Box>
          )}

          {chats.length !== 0 &&
            chats.map((i, index) =>
              i.user !== props.me.id ? (
                <Box
                  key={index}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <SingleChat
                    key={index}
                    text={i.text}
                    img={i.img}
                    likes={i.like}
                    me={props.me}
                    user={i.user}
                    userId={props.user.id}
                    id={i._id}
                    index={index}
                    socket={props.socket}
                  />
                </Box>
              ) : (
                <Box
                  key={index}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <SingleChat
                    key={index}
                    text={i.text}
                    img={i.img}
                    likes={i.like}
                    me={props.me}
                    user={i.user}
                    id={i._id}
                    userId={props.user.id}
                    index={index}
                    socket={props.socket}
                  />
                </Box>
              )
            )}
        </Box>
        <Box
          style={{
            position: "fixed",
            bottom: "20px",
            marginRight: "10px",
            marginLeft: "10px",
            width: "100%",
          }}
        >

          <ChatTextBottom dark={props.dark} me={props.me} user={props.user} socket={props.socket}/>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
