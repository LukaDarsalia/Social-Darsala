import React from "react";
import Blog from "./Blog";
import Box from "@material-ui/core/Box";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChatHead from "./ChatHead";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Skeleton from "@material-ui/lab/Skeleton";

export default function UsersBody(props) {
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
  const [blogs, setBlogs] = useStateCallback([]);
  const [openFollowings, setOpenFollowings] = React.useState(false);
  const [openFollowers, setOpenFollowers] = React.useState(false);
  const [full, setFull] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const [load, setLoad] = React.useState(null);
  const [counter, setCounter] = React.useState(2);

  const handleClickOpenFollowings = () => {
    setOpenFollowings(true);
  };
  const handleClickOpenFollowers = () => {
    setOpenFollowers(true);
  };
  const handleClose = () => {
    setOpenFollowings(false);
    setOpenFollowers(false);
  };
  let theme = null;
  const useStyles = makeStyles((theme) => ({
    media: {
      height: 250,
      [theme.breakpoints.up("md")]: {
        height: 290,
      },
    },
    card: {
      width: "85%",
      margin: "auto",
      marginBottom: "10px",
      [theme.breakpoints.up("sm")]: {
        width: "100%",
      },
      [theme.breakpoints.up(750)]: {
        width: "70%",
      },
      [theme.breakpoints.up("md")]: {
        width: "60%",
      },
      margin: theme.spacing(2),
    },
    page: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      width: "auto",
      [theme.breakpoints.up("sm")]: {
        width: "70%",
        margin: "auto",
      },
    },
    FollBox: {
      display: "flex",
      justifyContent: "center",
    },
    Foll: {
      display: "inline-flex",
      height: "max-content",
      margin: "20px",
      "&:hover": {
        cursor:"pointer",
      }
    },
    follow: {
      width: "85%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: "10px",
      [theme.breakpoints.up("sm")]: {
        width: "100%",
      },
      [theme.breakpoints.up(750)]: {
        width: "70%",
      },
      [theme.breakpoints.up("md")]: {
        width: "60%",
      },
    },
  }));
  const [followersData, setFollowersData] = React.useState([]);
  const [followingsData, setFollowingsData] = React.useState([]);

  React.useEffect(() => {
    const option = {
      method: "POST",
      url: "api/followers",
      data: { id: props.id },
      headers: { "Content-Type": "application/json" },
    };

    axios(option).then((res) => {
      setFollowersData(res.data.followers);
      setFollowingsData(res.data.followings);
     
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (props.dark === "light") {
    theme = createMuiTheme({
      typography: {
        fontFamily: ["Libre Baskerville", "sans-serif"].join(","),
      },
      palette: {
        type: props.dark,
        background: {
          default: "#dcdcdc",
        },
      },
    });
  } else {
    theme = createMuiTheme({
      typography: {
        fontFamily: ["Libre Baskerville", "sans-serif"].join(","),
      },
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
  
  const classes = useStyles();

  
  let c=0;
  function handleFollowClick() {
    if(c===0){
      if (followersData.some((e) => e.id === props.me.id) === false) {
        const data = {
          id: props.id,
          me: props.me.id,
          myName: props.me.name,
          name: props.name,
        };
        const options = {
          method: "post",
          url: "api/follow",
          data: data,
          headers: { "Content-Type": "application/json" },
        };
        axios(options).then((res) => {
          setFollowersData(res.data.followers);
        });
      } else {
        const data = { id: props.id, me: props.me.id };
        const options = {
          method: "post",
          url: "api/unfollow",
          data: data,
          headers: { "Content-Type": "application/json" },
        };
        axios(options).then((res) => {
          setFollowersData(res.data.followers);
        });
      }
    }
    c=c+1;
  }

  (function () {
    if (typeof Object.defineProperty === "function") {
      // eslint-disable-next-line no-extend-native
      try {
        Object.defineProperty(Array.prototype, "sortBy", { value: sb });
      } catch (e) {}
    }
    // eslint-disable-next-line no-extend-native
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
      for (var i = this.length; i; ) {
        var o = this[--i];
        this[i] = [].concat(f.call(o, o, i), o);
      }
      this.sort(function (a, b) {
        for (var i = 0, len = a.length; i < len; ++i) {
          // eslint-disable-next-line eqeqeq
          if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
        }
        return 0;
      });
      // eslint-disable-next-line no-redeclare
      for (var i = this.length; i; ) {
        this[--i] = this[i][this[i].length - 1];
      }
      return this;
    }
  })();

  useBottomScrollListener(()=>{
    if (full === false) {
      setFull(true);
      setOpen(true);
      props.socket.emit("newBlog", {
        counter: counter,
        id: props.id,
      });
    }
  });
  React.useEffect(()=>{
    props.socket.on("getNewBlog", (msg) => {
      setBlogs((prev) => prev.concat(msg.blogs.sortBy((o) => o.time).reverse()));
      setOpen(false);
      setLoad(msg.full);
      setCounter((prev) => prev + 1);
      setOpen(false);
      // setBlogs((prev) => [...new Set(prev)]);
      setFull(msg.full);
    });
  }, []);
  React.useEffect(() => {
    const option = {
      method: "POST",
      url: "api/usersBlogs",
      data: {id:props.id},
      headers: { "Content-Type": "application/json" },
    };

    axios(option).then((res) => {
      setOpen(false);
      setBlogs(res.data[0].sortBy((o) => o.time).reverse());
      setFull(res.data[1]);
      setLoad(res.data[1]);
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (open === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);
  
  const history = useHistory();
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Box className={classes.page}>
        <Backdrop style={{zIndex:"9"}} className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box className={classes.FollBox}>
            <Typography className={classes.Foll} onClick={handleClickOpenFollowers}>
              {followersData.length + " followers"}
            </Typography>
            <Dialog
            open={openFollowers}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>{"Followers"}</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ width: "400px" }}>
                {followersData.length !== 0 &&
                  followersData.map((i, index) => (
                    <ChatHead
                      key={index}
                      name={i.name}
                      socket={props.socket}
                      id={i.id}
                      clicker={() => history.push("/" + i.id)}
                      lastText={""}
                      cond={true}
                      dark={props.dark}
                    />
                  ))}
              </DialogContentText>
            </DialogContent>
          </Dialog>
            <Typography className={classes.Foll} onClick={handleClickOpenFollowings}>
              {followingsData.length + " followings"}
            </Typography>
            <Dialog
            open={openFollowings}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>{"Followings"}</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ width: "400px" }}>
                {followingsData.length !== 0 &&
                  followingsData.map((i, index) => (
                    <ChatHead
                      key={index}
                      name={i.name}
                      socket={props.socket}
                      id={i.id}
                      clicker={() => history.push("/" + i.id)}
                      lastText={""}
                      cond={true}
                      dark={props.dark}
                    />
                  ))}
              </DialogContentText>
            </DialogContent>
          </Dialog>
          </Box>
          <Box className={classes.follow}>
            <Button variant="outlined" onClick={handleFollowClick}>
              <Typography style={{ fontSize: "1rem" }}>
                {followersData.some((e) => e.id === props.me.id) === true
                  ? "Unfollow"
                  : "Follow"}
              </Typography>
              <PersonAddIcon
                style={{
                  marginLeft: "5px",
                  height: "100%",
                  fontSize: "1.5rem",
                  paddingTop: "1px",
                }}
              />
            </Button>
          </Box>
          {blogs.length !== 0 && (
            <Box
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {blogs.map((i, index) => (
                <Blog
                  key={index}
                  me={props.me}
                  mine={props.blogs}
                  dark={props.dark}
                  name={props.name}
                  socket={props.socket}
                  time={i.time}
                  img={i.img}
                  title={i.title}
                  id={props.id}
                  blogId={i._id}
                  content={i.content}
                  comments={i.comments}
                  likes={i.likes}
                />
              ))}
              {load === false && (
                  <Card className={classes.card}>
                    <CardHeader
                      avatar={
                        <Skeleton
                          animation="wave"
                          variant="circle"
                          width={40}
                          height={40}
                        />
                      }
                      action={null}
                      title={
                        <Skeleton
                          animation="wave"
                          height={10}
                          width="80%"
                          style={{ marginBottom: 6 }}
                        />
                      }
                      subheader={
                        <Skeleton animation="wave" height={10} width="40%" />
                      }
                    />

                    <Skeleton
                      animation="wave"
                      variant="rect"
                      className={classes.media}
                    />

                    <CardContent>
                      <React.Fragment>
                        <Skeleton
                          animation="wave"
                          height={10}
                          style={{ marginBottom: 6 }}
                        />
                        <Skeleton animation="wave" height={10} width="80%" />
                      </React.Fragment>
                    </CardContent>
                  </Card>
                )}
            </Box>
          )}
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
