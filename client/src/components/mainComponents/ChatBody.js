import React from "react";
import Box from "@material-ui/core/Box";
import axios from "axios";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { matchSorter } from "match-sorter";
import { fade, makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import { IconButton } from "@material-ui/core";
import ChatHead from "./ChatHead";
import useState from "react-usestateref";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

var _ = require("lodash");

export default function Chat(props) {
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
  (function () {
    if (typeof Object.defineProperty === "function") {
      try {
        Object.defineProperty(Array.prototype, "sortBy", { value: sb });
      } catch (e) {}
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
      for (var i = this.length; i; ) {
        var o = this[--i];
        this[i] = [].concat(f.call(o, o, i), o);
      }
      this.sort(function (a, b) {
        for (var i = 0, len = a.length; i < len; ++i) {
          if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
        }
        return 0;
      });
      for (var i = this.length; i; ) {
        this[--i] = this[i][this[i].length - 1];
      }
      return this;
    }
  })();
  let color = "";
  const [load, setLoad] = React.useState(false);
  const [headLoad, setHeadLoad] = React.useState(true);
  props.dark === "dark" ? (color = "#026290") : (color = "#cfcfcf");
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    search: {
      borderRadius: 40,
      border: "1.5px solid",
      marginTop: "20px",
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },

      height: "6ch",
      zIndex: "1",
      marginLeft: theme.spacing(2),
      width: "auto",
      top: "auto",
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        position: "relative",
        marginRight: "15px",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "45px",
      [theme.breakpoints.up("sm")]: {
        height: "100%",
      },
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      height: "25px",
      width: "100%",
    },
    beforeFrame: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        height: "calc(100vh - 75px)",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "contrast(1.03)",
      },
    },
    people: {
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "450px",
      },
    },
    Frame: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      height: "100%",
      width: "100%",
      border: "none",
      margin: 0,
      padding: 0,
      overflow: "hidden",
      zIndex: "2",
      [theme.breakpoints.up("sm")]: {
        zIndex: "0",
        position: "relative",
        height: "calc(100vh - 75px)",
      },
    },
    return: {
      position: "fixed",
      top: "16px",
      left: "20px",
      zIndex: "3",
      backgroundColor: color,
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
  }));
  const filterOptions = ((options, { inputValue }) =>{return(options)});
  const classes = useStyles();
  const [opt, setOpt] = React.useState([]);
  // eslint-disable-next-line
  const [search, setSearch] = React.useState("");
  const [on, setOn] = React.useState(false);
  const [chatHead, setChatHead] = useStateCallback([]);
  const [link, setLink] = React.useState("");
  let chatHeadDva = [];
  function changeHandler(event) {
    const value = event.target.value;
    setSearch(value);
    if (value === "") {
      setOpt([]);
    } else {
      var option={
        method: "POST",
        url: "api/getNames",
        data: {name: value},
        headers: { "Content-Type": "application/json" },
      }
      axios(option).then((msg)=>{
        setOpt(msg.data.filter(i=>i.id!==props.me.id));
      });
    }
  }
  function getOptLabel(option) {
    
    setSearch("")
    return "";
  }

  React.useEffect(() => {
   
      const option = {
        method: "GET",
        url: "api/chatHeads",
        headers: { "Content-Type": "application/json" },
      };
      axios(option).then((response) => {
        setHeadLoad(false);
        const d = response.data;
        
        if (!_.isEqual(d, chatHeadDva) || d.length === 0) {
          
          d.sortBy(function (o) {
            return o.time;
          });
          d.reverse();
          chatHeadDva = d;
          setChatHead(chatHeadDva, (chatHead) => {
            
            props.socket.on("sendTextServer", (msg) => {
              if (msg.user !== props.me.id) {
                if (chatHead === []) {
                  if ("text" in msg) {
                    setChatHead([
                      {
                        lastText: msg.text,
                        id: msg.user,
                        cond: false,
                        name: msg.name,
                        time: msg.time,
                      },
                    ]);
                    chatHead.unshift({
                      lastText: msg.text,
                      id: msg.user,
                      cond: false,
                      name: msg.name,
                      time: msg.time,
                    });
                  } else {
                    setChatHead([
                      {
                        lastText:
                          msg.name.split(" ")[0] + " has sent you a photo",
                        id: msg.user,
                        cond: false,
                        name: msg.name,
                        time: msg.time,
                      },
                    ]);
                    chatHead.unshift({
                      lastText:
                        msg.name.split(" ")[0] + " has sent you a photo",
                      id: msg.user,
                      cond: false,
                      name: msg.name,
                      time: msg.time,
                    });
                  }
                }
                if (!chatHead.some((i) => i.id === msg.user)) {
                  if ("text" in msg) {
                    setChatHead((prev) => [
                      {
                        lastText: msg.text,
                        id: msg.user,
                        cond: false,
                        name: msg.name,
                        time: msg.time,
                      },
                      ...prev,
                    ]);
                    chatHead.unshift({
                      lastText: msg.text,
                      id: msg.user,
                      cond: false,
                      name: msg.name,
                      time: msg.time,
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  } else {
                    setChatHead((prev) => [
                      {
                        lastText:
                          msg.name.split(" ")[0] + " has sent you a photo",
                        id: msg.user,
                        cond: false,
                        name: msg.name,
                        time: msg.time,
                      },
                      ...prev,
                    ]);
                    chatHead.unshift({
                      lastText:
                        msg.name.split(" ")[0] + " has sent you a photo",
                      id: msg.user,
                      cond: false,
                      name: msg.name,
                      time: msg.time,
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  }
                } else {
                  if ("text" in msg) {
                    setChatHead((chatHeadd) => {
                      chatHeadd.forEach((i) => {
                        if (i.id === msg.user) {
                          i.lastText = msg.text;
                          i.cond = false;
                          i.time = msg.time;
                        }
                      });
                      chatHeadd.sortBy(function (o) {
                        return o.time;
                      });
                      chatHeadd.reverse();
                      return [...chatHeadd];
                    });

                    chatHead.forEach((i) => {
                      if (i.id === msg.user) {
                        i.lastText = msg.text;
                        i.cond = false;
                        i.time = msg.time;
                      }
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  } else {
                    setChatHead((chatHeadd) => {
                      chatHeadd.forEach((i) => {
                        if (i.id === msg.user) {
                          i.lastText =
                            msg.name.split(" ")[0] + " has sent you a photo";
                          i.cond = false;
                          i.time = msg.time;
                        }
                      });
                      chatHeadd.sortBy(function (o) {
                        return o.time;
                      });
                      chatHeadd.reverse();
                      return [...chatHeadd];
                    });

                    chatHead.forEach((i) => {
                      if (i.id === msg.user) {
                        i.lastText =
                          msg.name.split(" ")[0] + " has sent you a photo";
                        i.cond = false;
                        i.time = msg.time;
                      }
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  }
                }
              } else {
                
                if (chatHead === []) {
                  if ("text" in msg) {
                    setChatHead([
                      {
                        lastText: "You: " + msg.text,
                        id: msg.receiver,
                        cond: true,
                        name: msg.receiverName,
                        time: msg.time,
                      },
                    ]);
                    chatHead.unshift({
                      lastText: "You: " + msg.text,
                      id: msg.receiver,
                      cond: true,
                      name: msg.receiverName,
                      time: msg.time,
                    });
                  } else {
                    setChatHead([
                      {
                        lastText: "You have sent a photo",
                        id: msg.receiver,
                        cond: true,
                        name: msg.receiverName,
                        time: msg.time,
                      },
                    ]);
                    chatHead.unshift({
                      lastText: "You have sent a photo",
                      id: msg.receiver,
                      cond: true,
                      name: msg.receiverName,
                      time: msg.time,
                    });
                  }
                }
                if (!chatHead.some((i) => i.id === msg.receiver)) {
                  if ("text" in msg) {
                    setChatHead((prev) => [
                      {
                        lastText: "You: " + msg.text,
                        id: msg.receiver,
                        cond: true,
                        name: msg.receiverName,
                        time: msg.time,
                      },
                      ...prev,
                    ]);
                    chatHead.unshift({
                      lastText: "You: " + msg.text,
                      id: msg.receiver,
                      cond: true,
                      name: msg.receiverName,
                      time: msg.time,
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  } else {
                    setChatHead((prev) => [
                      {
                        lastText: "You have sent a photo",
                        id: msg.receiver,
                        cond: true,
                        name: msg.receiverName,
                        time: msg.time,
                      },
                      ...prev,
                    ]);
                    chatHead.unshift({
                      lastText: "You have sent a photo",
                      id: msg.receiver,
                      cond: true,
                      name: msg.receiverName,
                      time: msg.time,
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  }
                } else {
                  if ("text" in msg) {
                    setChatHead((chatHeadd) => {
                      chatHeadd.forEach((i) => {
                        if (i.id === msg.receiver) {
                          i.lastText = "You: " + msg.text;
                          i.cond = true;
                          i.time = msg.time;
                        }
                      });
                      chatHeadd.sortBy(function (o) {
                        return o.time;
                      });
                      chatHeadd.reverse();
                      return [...chatHeadd];
                    });
                    // setChatHead((chatHead) => {
                    chatHead.forEach((i) => {
                      if (i.id === msg.receiver) {
                        i.lastText = "You: " + msg.text;
                        i.cond = true;
                        i.time = msg.time;
                      }
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  } else {
                    setChatHead((chatHeadd) => {
                      chatHeadd.forEach((i) => {
                        if (i.id === msg.receiver) {
                          i.lastText = "You have sent a photo";
                          i.cond = true;
                          i.time = msg.time;
                        }
                      });
                      chatHeadd.sortBy(function (o) {
                        return o.time;
                      });
                      chatHeadd.reverse();
                      return [...chatHeadd];
                    });
                    // setChatHead((chatHead) => {
                    chatHead.forEach((i) => {
                      if (i.id === msg.receiver) {
                        i.lastText = "You have sent a photo";
                        i.cond = true;
                        i.time = msg.time;
                      }
                    });
                    chatHead.sortBy(function (o) {
                      return o.time;
                    });
                    chatHead.reverse();
                  }
                }
              }
            });
          });
        }
      });
    
  }, []);
  React.useEffect(() => {
    props.socket.on("seen", (msg) => {
      setChatHead((chatHead) => {
        chatHead.some((i) => {
          i.id === msg.id && (i.cond = msg.seen);
        });

        return [...chatHead];
      });
    });
  }, []);

  let theme = null;
  if (props.dark === "light") {
    theme = createMuiTheme({
      palette: {
        type: props.dark,
        background: {
          default: "#f9f9f9",
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
  function clicker(id) {
    setOn(true);
    setLink("/chat-" + id);
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      try {
        document.getElementsByClassName("dropDown")[0].click();
      } catch (error) {
        console.log("User Doesn't exists!");
      }
      
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box style={{ display: "flex" }}>
        <Box className={classes.people}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <Autocomplete
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              freeSolo
              disableClearable
              autoHighlight
              options={opt}
              filterOptions={filterOptions}
              getOptionLabel={getOptLabel}
              renderOption={(option) => {
                return <span className="dropDown" style={{width:"100%", height:"100%"}} onClick={()=>{clicker(option.id)}}>{option.name}</span>;
              }}
              renderInput={(params) => (
                <InputBase
                  {...params}
                  ref={params.InputProps.ref}
                  placeholder="Search…"
                  type="text"
                  value={search}
                  onKeyDown={handleKeyDown}
                  onChange={changeHandler}
                  className={(classes.inputInput, classes.inputRoot, "name")}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                    "aria-label": "search",
                  }}
                />
              )}
            />
          </div>
          <Backdrop className={classes.backdrop} open={headLoad}>
            <CircularProgress color="inherit" />
          </Backdrop>
          {chatHead.length !== 0 &&
            chatHead.map((i, index) => (
              <ChatHead
                key={index}
                name={i.name}
                id={i.id}
                socket={props.socket}
                clicker={clicker.bind(this, i.id)}
                lastText={i.lastText}
                cond={i.cond}
                dark={props.dark}
              />
            ))}
        </Box>
        {on === true && (
          <IconButton className={classes.return} href="/chat">
            <KeyboardReturnIcon style={{}} />
          </IconButton>
        )}
        {on === true && load === false && (
          <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}

        {on === true ? (
          <iframe
            title="Chat"
            src={link}
            frameBorder="0"
            onLoad={() => setLoad(true)}
            className={classes.Frame}
            height="100%"
            width="100%"
          ></iframe>
        ) : (
          <div className={classes.beforeFrame}>
            <h1>Search people to message</h1>
          </div>
        )}
      </Box>
    </ThemeProvider>
  );
}
