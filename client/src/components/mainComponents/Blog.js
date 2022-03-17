import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { deepOrange } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import Comment from "./Comment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";

export default function Blog(props) {
  let color = "";
  props.dark === "dark" ? (color = "#026290") : (color = "#D93A34");
  const [like, setLike] = React.useState(props.likes.includes(props.me.id));
  const [likeLength, setLikeLength] = React.useState(props.likes.length);
  const [fullMode, setFullMode] = React.useState(false);
  const history = useHistory();
  const useStyles = makeStyles((theme) => ({
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
    },
    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: color,
    },
    buttonGroup: {
      marginBottom: "10px",
    },
    CommentSection: {
      display: "flex",
      alignItems: "flex-end",
    },
    Comment: {
      width: "80%",
      padding: "16px",
    },
    button: {
      marginBottom: "20px",
      marginRight: "10px",
    },
  }));

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
        background: {
          default: "rgb(0, 20, 40)",
          paper: "rgb(10, 25, 41)",
        },
        divider: "rgb(10, 25, 41)",
      },
    });
  }
  const classes = useStyles();
  let DateNow = Date.parse(props.time);
  let date = new Date(DateNow);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let year = date.getFullYear();
  let month = monthNames[date.getMonth()];
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let minute = "";
  if (minutes < 10) {
    minute = "0" + minutes;
  } else {
    minute = minutes;
  }

  let d = new Date();
  let between = d.getTime() - date.getTime();
  const [display, setDisplay] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [commentDis, setCommentDis] = React.useState(props.comments);
  const handleChange = (event) => {
    setComment(event.target.value);
  };

  function handleClick(event) {
    if (comment !== "") {
      if (comment.trim().length) {
        const data = {
          id: props.id,
          blogId: props.blogId,
          myId: props.me.id,
          myName: props.me.name,
          text: comment,
        };
        const options = {
          method: "post",
          url: "api/comment",
          data: data,
          headers: { "Content-Type": "application/json" },
        };
        axios(options).then(() => {
          setComment("");
        });
      }
    }
  }
  function handleLikeClick(event) {
    if (like === false) {
      const data = {
        id: props.id,
        blogId: props.blogId,
        me: props.me.id,
      };
      const options = {
        method: "post",
        url: "api/like",
        data: data,
        headers: { "Content-Type": "application/json" },
      };
      axios(options).then(() => {
        setLike(true);
        setLikeLength(likeLength + 1);
      });
    } else {
      const data = {
        id: props.id,
        blogId: props.blogId,
        me: props.me.id,
      };
      const options = {
        method: "post",
        url: "api/unlike",
        data: data,
        headers: { "Content-Type": "application/json" },
      };
      axios(options).then(() => {
        setLike(false);
        setLikeLength(likeLength - 1);
      });
    }
  }
  function handleCommentClick(event) {
    setDisplay((prevDisplay) => !prevDisplay);
  }
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleYes = () => {
    setOpen(false);
    const data = { id: props.blogId };
    const options = {
      method: "post",
      url: "api/blogsDelete",
      data: data,
      headers: { "Content-Type": "application/json" },
    };
    axios(options).then(() => {
      history.push("/");
      window.location.reload();
    });
  };

  (function () {
    if (typeof Object.defineProperty === "function") {
      // eslint-disable-next-line no-extend-native
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
  React.useEffect(() => {
    setCommentDis(c => c.sortBy((o) => o.time).reverse());
  }, []);
  React.useEffect(() => {
    props.socket.on("blogUpdate", (msg) => {
      msg._id === props.blogId &&
        setCommentDis(msg.comments.sortBy((o) => o.time).reverse());
    });
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <Card className={classes.card}>
        {props.id === props.me.id ? (
          <CardHeader
            avatar={<Avatar className={classes.avatar}>{props.name[0]}</Avatar>}
            action={
              <Box>
                <IconButton aria-label="Remove" onClick={handleClickOpen}>
                  <RemoveCircleIcon />
                </IconButton>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Do you want to delete this post?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleYes} autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            }
            subheader={
              between / (1000 * 60 * 60 * 24 * 365) > 1
                ? month + " " + day + ", " + year
                : between / (1000 * 60 * 60 * 24) > 1
                ? month + " " + day + " at " + hours + ":" + minute
                : between / (1000 * 60 * 60) > 1
                ? Math.ceil(between / (1000 * 60 * 60)) + "h"
                : Math.ceil(between / (1000 * 60)) + "m"
            }
            title={props.name}
          />
        ) : (
          <CardHeader
            avatar={<Avatar className={classes.avatar}>{props.name[0]}</Avatar>}
            subheader={
              between / (1000 * 60 * 60 * 24 * 365) > 1
                ? month + " " + day + ", " + year
                : between / (1000 * 60 * 60 * 24) > 1
                ? month + " " + day + " at " + hours + ":" + minute
                : between / (1000 * 60 * 60) > 1
                ? Math.ceil(between / (1000 * 60 * 60)) + "h"
                : Math.ceil(between / (1000 * 60)) + "m"
            }
            title={
              <Box
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/" + props.id)}
              >
                {props.name}
              </Box>
            }
          />
        )}

        {props.title === "" ? (
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.content}
            </Typography>
          </CardContent>
        ) : (
          <CardContent>
            <Typography gutterBottom variant="h4" component="h2">
              {props.title}
            </Typography>
            <Typography variant="h5" component="p">
              {props.content}
            </Typography>
          </CardContent>
        )}
        {fullMode === false ? (
          <Box>
            {props.img !== undefined && (
              <img
                onClick={() => {
                  setFullMode((prev) => !prev);
                }}
                style={{
                  width: "-moz-available",
                  height: "-moz-available",
                  width: "-webkit-fill-available",
                  height: "-webkit-fill-available",
                  height:"stretch",
                  cursor: "zoom-in",
                }}
                src={`data:image/${props.img.contentType};base64,${Buffer.from(
                  props.img.data.data
                ).toString("base64")}`}
              />
            )}
          </Box>
        ) : (
          <Box>
            {props.img !== undefined && (
              <img
                onClick={() => {
                  setFullMode((prev) => !prev);
                }}
                style={{
                  background:
                    "RGBA(0,0,0,.5) url(" +
                    `data:image/${props.img.contentType};base64,${Buffer.from(
                      props.img.data.data
                    ).toString("base64")}` +
                    ") no-repeat center",
                  backgroundSize: "contain",
                  width: "100%",
                  height: "100%",
                  position: "fixed",
                  zIndex: "10000",
                  top: "0",
                  left: "0",
                  cursor: "zoom-out",
                }}
                src={`data:image/${props.img.contentType};base64,${Buffer.from(
                  props.img.data.data
                ).toString("base64")}`}
              />
            )}
          </Box>
        )}

        <ButtonGroup variant="text" fullWidth className={classes.buttonGroup}>
          <Button onClick={handleLikeClick}>
            {like === false ? (
              <Typography>
                <FavoriteBorderIcon />
                {likeLength === 0 ? "" : likeLength}
              </Typography>
            ) : (
              <Typography>
                <FavoriteIcon />
                {likeLength === 0 ? "" : likeLength}
              </Typography>
            )}
          </Button>
          <Button onClick={handleCommentClick}>
            {display === true ? (
              <Typography>
                <ChatBubbleIcon />
                {props.comments.length === 0 ? "" : props.comments.length}
              </Typography>
            ) : (
              <Typography>
                <ChatBubbleOutlineIcon />
                {props.comments.length === 0 ? "" : props.comments.length}
              </Typography>
            )}
          </Button>
        </ButtonGroup>
        {display === true && (
          <Box>
            <Box className={classes.CommentSection}>
              <TextField
                label="Comment"
                value={comment}
                multiline
                onChange={handleChange}
                rowsMax={Infinity}
                InputProps={{ style: { fontSize: 20 } }}
                InputLabelProps={{ style: { fontSize: 16, padding: "16px" } }}
                className={classes.Comment}
              ></TextField>
              <Button
                className={classes.button}
                size="small"
                variant="outlined"
                onClick={handleClick}
              >
                Comment
              </Button>
            </Box>
            <Box>
              <Card>
                {commentDis.length !== 0 && (
                  <Box>
                    {commentDis.map((i, index) => (
                      <Comment
                        key={index}
                        id={i.commentUserId}
                        blogId={props.blogId}
                        blogName={props.id}
                        likes={i.likes}
                        commentId={i._id}
                        name={i.commentUserName}
                        dark={props.dark}
                        comment={i.text}
                        time={i.time}
                        me={props.me}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Box>
          </Box>
        )}
      </Card>
    </ThemeProvider>
  );
}
