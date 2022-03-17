/* eslint-disable no-use-before-define */
import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import { createBrowserHistory } from "history";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import ChatIcon from "@material-ui/icons/Chat";
import Box from "@material-ui/core/Box";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import sound from "../sounds/Notification_sound.mp3";
import { useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const themee = createMuiTheme({
  breakpoints: {
    values: {
      f: 359,
      s: 380,
      t: 409,
      ft: 430,
      fth: 460,
      sx: 480,
      sv: 520,
      e: 580,
      n: 680,
      tn: 750,
      el: 880,
      kk: 950,
      tw: 1100,
      ll: 1200,
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: "-webkit-sticky",
    // eslint-disable-next-line no-dupe-keys
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    height: "auto",
    flexGrow: 1,
    zIndex: "2",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: "absolute",
    borderRadius: 40,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(1),
    top: "15px",
    height: "6ch",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
      display: "auto",
      top: "auto",
      alignItems: "auto",
    },
    zIndex: "1",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
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
    width: "0ch",
    "&:focus": {
      width: "10ch",
    },
    [theme.breakpoints.up(themee.breakpoints.values.f)]: {
      "&:focus": {
        width: "13ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.s)]: {
      "&:focus": {
        width: "15ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.t)]: {
      "&:focus": {
        width: "17ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.ft)]: {
      "&:focus": {
        width: "19ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.fth)]: {
      "&:focus": {
        width: "21ch",
      },
    },
    [theme.breakpoints.up("sm")]: {
      width: "0ch",
      "&:focus": {
        width: "12ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.n)]: {
      "&:focus": {
        width: "14ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.tn)]: {
      "&:focus": {
        width: "17ch",
      },
    },
    [theme.breakpoints.up(themee.breakpoints.values.el)]: {
      "&:focus": {
        width: "21ch",
      },
    },
    [theme.breakpoints.up("md")]: {
      "&:focus": {
        width: "25ch",
      },
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  centerBox: {
    display: "flex",
    justifyContent: "space-evenly",
    alignSelf: "flex-end",
    alignContent: "center",
    width: "100%",
    marginBottom: "-10px",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(0, 20),
      marginBottom: "0px",
    },
    [theme.breakpoints.up(themee.breakpoints.values.tn)]: {
      padding: theme.spacing(0, 30),
    },
    [theme.breakpoints.up(themee.breakpoints.values.kk)]: {
      padding: theme.spacing(0, 40),
    },
    [theme.breakpoints.up(themee.breakpoints.values.tw)]: {
      padding: theme.spacing(0, 45),
    },
    [theme.breakpoints.up(themee.breakpoints.values.ll)]: {
      padding: theme.spacing(0, 60),
    },
  },
  rightBox: {
    display: "flex",
    justifyContent: "flex-end",
    alignSelf: "flex-start",
    margin: theme.spacing(0, -17),
  },
  toolbar: {
    height: "125px",
    [theme.breakpoints.up("sm")]: {
      height: "auto",
    },
  },
}));

export default function Navbar(props) {
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

  const [seen, setSeen] = React.useState(true);

  React.useEffect(() => {

    const options = {
      method: "get",
      url: "api/seen",
      headers: { "Content-Type": "application/json" },
    };
    axios(options).then((res) => {
      let da = [];

      res.data.forEach((i) => {
        i.cond === false && setSeen(false);
      });
      res.data.forEach((i) => {
        da.push(i.cond);
      });
      if (da.includes(false) === false) {
        setSeen(true);
      }
    });
  }, []);

  const filterOptions = ((options, { inputValue }) =>{return(options)});
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
  const classes = useStyles();
  const [opt, setOpt] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [condition, setCondition] = useStateCallback([]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    props.socket.emit("id", { id: props.me.id, name: props.me.name });
    props.socket.on("seen", (msg) => {
      setCondition(msg, (c) => {
        if (msg.seen === false) {
          try {
            const newMessage = new Audio(sound);
            newMessage.play(); 
          } catch (error) {
            console.log("Sound can't be played, because of these fucker who disabled autoplay!")
          }
          
          if (window.location.pathname.substring(0.6) !== "/chat") {
            setOpen(true);
            setText("You have new message from " + msg.name);
            setSeen(false);
          }
        } else {
          if (condition === []) {
            setSeen(true);
          } else {
            if (!condition.some((e) => e.seen === false)) {
              setSeen(true);
            } else {
              setSeen(false);
            }
          }
        }
      });
    });
  }, []);

  let darkMode = props.dark;
  let darkModeBool = false;
  darkMode === "dark" ? (darkModeBool = true) : (darkModeBool = false);
  function changeHandler(event) {
    const value = event.target.value;
    setSearch(value);
    if (value === "") {
      setOpt([]);
    } else {
      var opt={
        method: "POST",
        url: "api/getNames",
        data: {name: value},
        headers: { "Content-Type": "application/json" },
      }
      axios(opt).then((msg)=>{
        setOpt(msg.data);
      });
    }
    
  }
  function clickHandler(event) {
    darkMode === "dark" ? (darkMode = "light") : (darkMode = "dark");
    darkMode === "dark" ? (darkModeBool = true) : (darkModeBool = false);
    const options = {
      method: "post",
      url: "api/darkMode",
      data: { darkMode: darkModeBool },
      headers: { "Content-Type": "application/json" },
    };
    axios(options).then(() => {
      window.location.reload();
    });
  }
  
  const historySearch = createBrowserHistory({
    forceRefresh: true,
  });
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          {text}
        </Alert>
      </Snackbar>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* {darkMode === "dark" ? ( */}

        <AppBar position="static" color="inherit">
          <Toolbar className={classes.toolbar}>
            
            <div className={classes.search} style={{border: (props.dark==="light") && "1.5px solid"}}>
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
                getOptionLabel={(option) => {
                  option.id === undefined ? historySearch.push("/404") : historySearch.push("/" + option.id);
                  return "";
                }}
                renderOption={(option) => {
                  return <span>{option.name}</span>;
                }}
                renderInput={(params) => (
                  <InputBase
                    {...params}
                    ref={params.InputProps.ref}
                    placeholder="Search…"
                    value={search}
                    onChange={changeHandler}
                    className={(classes.inputInput, classes.inputRoot)}
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                      "aria-label": "search",
                    }}
                  />
                )}
              />
            </div>
            <Box className={classes.centerBox}>
              <IconButton
                aria-label="Home"
                className={classes.margin}
                onClick={() => window.location.pathname==="/" ? historySearch.push("/") : history.push("/")}
              >
                <HomeIcon fontSize="large" />
              </IconButton>
              <IconButton
                aria-label="Me"
                className={classes.margin}
                onClick={() => window.location.pathname==="/"+props.me.id ? historySearch.push("/"+props.me.id) : history.push("/"+props.me.id)}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              {seen === false ? (
                <IconButton
                  aria-label="Chat"
                  className={classes.margin}
                  onClick={() => window.location.pathname==="/chat" ? historySearch.push("/chat") : history.push("/chat")}
                >
                  <ChatIcon fontSize="large" style={{ color: "red" }} />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="Chat"
                  className={classes.margin}
                  onClick={() => window.location.pathname==="/chat" ? historySearch.push("/chat") : history.push("/chat")}
                >
                  <ChatIcon fontSize="large" />
                </IconButton>
              )}
            </Box>
            <Box className={classes.rightBox}>
              <IconButton
                aria-label="Dark Mode"
                className={classes.margin}
                onClick={clickHandler}
              >
                {darkMode === "dark" ? (
                  <Brightness7Icon fontSize="large" />
                ) : (
                  <Brightness4Icon fontSize="large" />
                )}
              </IconButton>
              <IconButton
                aria-label="Log out"
                className={classes.margin}
                onClick={() => {
                  const options = {
                    method: "post",
                    url: "api/logout",
                    data: {},
                    headers: { "Content-Type": "application/json" },
                  };
                  axios(options).then(() => {
                    historySearch.push("/");
                  });
                }}
              >
                <ExitToAppIcon fontSize="large" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  );
}
