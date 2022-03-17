import React from "react";
import Typography from "@material-ui/core/Typography";
import Blog from "./Blog";
import Box from "@material-ui/core/Box";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Skeleton from "@material-ui/lab/Skeleton";

export default function Body(props) {
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
        // eslint-disable-next-line no-extend-native
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
  let theme = null;
  const [open, setOpen] = React.useState(true);
  const [load, setLoad] = React.useState(null);
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
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
    },
    follow: {
      width: "85%",
      height: "100%",
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
          paper: "rgb(3, 15, 27)",
        },
        divider: "rgb(10, 25, 41)",
      },
    });
  }

  const classes = useStyles();
  const [counter, setCounter] = React.useState(2);
  const [full, setFull] = React.useState(null);
  const [blogs, setBlogs] = useStateCallback([]);
  React.useEffect(() => {
    const option = {
      method: "GET",
      url: "api/timeline",
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

  useBottomScrollListener(()=>{
    if (full === false) {
      setFull(true);
      setOpen(true);
      props.socket.emit("newTimeline", {
        counter: counter,
        id: props.me.id,
      });
    }
  });

  React.useEffect(()=>{
    props.socket.on("getNewTimeline", (msg) => {
      setBlogs((prev) => prev.concat(msg.blogs.sortBy((o) => o.time).reverse()));
      setOpen(false);
      setLoad(msg.full);
      setCounter((prev) => prev + 1);
      setOpen(false);
      // setBlogs((prev) => [...new Set(prev)]);
      setFull(msg.full);
    });
  }, []);
  React.useEffect(()=>{
    if(open===true){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }
  },[open]);
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box className={classes.page}>
          <Box
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {blogs.length === 0 ? (
              <Typography variant="h4" style={{ margin: "0 15px" }}>
                Follow people to see their posts
              </Typography>
            ) : (
              blogs.map((i, index) => (
                <Blog
                  key={index}
                  me={props.me}
                  socket={props.socket}
                  mine={props.blogs}
                  dark={props.dark}
                  name={i.authorName}
                  time={i.time}
                  img={i.img}
                  title={i.title}
                  id={i.authorId}
                  blogId={i._id}
                  content={i.content}
                  comments={i.comments}
                  likes={i.likes}
                  click={props.click}
                />
              ))
            )}
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
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
