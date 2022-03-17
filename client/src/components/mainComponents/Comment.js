import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Button from "@material-ui/core/Button";
import { deepOrange } from "@material-ui/core/colors";
import axios from "axios";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function Comment(props) {
  let color = "";
  props.dark === "dark" ? (color = "#026290") : (color = "#D93A34");
  const [like, setLike] = React.useState(props.likes.includes(props.me.id));
  const [likeLength, setLikeLength] = React.useState(props.likes.length);
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
  const useStyles = makeStyles((theme) => ({
    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: color,
    },
    like: {
      fontSize: "18px",
      marginBottom:"3px",
      marginLeft: "18px",
      "&:hover": {
        filter: "contrast(0.5)",
        cursor: "pointer",
      },
    },
  }));
  const classes = useStyles();
  let d = new Date();
  let yearNow = d.getFullYear();
  let dayNow = d.getDate();
  let hoursNow = d.getHours();
  let between = d.getTime() - date.getTime();

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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function handleLikeClick(event) {
    if (like === false) {
      const data = {
        id: props.id,
        blogId: props.blogId,
        commentId : props.commentId,
        me: props.me.id,
      };
      const options = {
        method: "post",
        url: "api/likeComment",
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
        commentId : props.commentId,
        blogId: props.blogId,
        me: props.me.id,
      };
      const options = {
        method: "post",
        url: "api/unlikeComment",
        data: data,
        headers: { "Content-Type": "application/json" },
      };
      axios(options).then(() => {
        setLike(false);
        setLikeLength(likeLength - 1);
      });
    }
  }
  const handleYes = () => {
    setOpen(false);
    const data = {
      id: props.blogName,
      blogId: props.blogId,
      commentId: props.commentId,
    };
    const options = {
      method: "post",
      url: "api/commentDelete",
      data: data,
      headers: { "Content-Type": "application/json" },
    };
    axios(options);
  };
  return (
    <ThemeProvider theme={theme}>
      <Card>
        {props.me.id === props.id.toString() ? (
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
                    {"Do you want to delete this comment?"}
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
              yearNow - year !== 0
                ? month + " " + day + ", " + year
                : dayNow - day !== 0
                ? month + " " + day + " at " + hours + ":" + minute
                : hoursNow - hours !== 0
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
            title={props.name}
          />
        )}
        <CardContent style={{ paddingTop: 0 }}>
          <Typography variant="body2" component="p">
            {props.comment}
          </Typography>
        </CardContent>
        
        <Box>
          {like === false ? (
            <Box style={{marginBottom:"10px"}}>
              <FavoriteBorderIcon className={classes.like} onClick={handleLikeClick}/>
              {likeLength === 0 ? "" : likeLength}
            </Box>
            
          ) : (
            <Box style={{marginBottom:"10px"}}>
              <FavoriteIcon className={classes.like} onClick={handleLikeClick}/>
            {likeLength === 0 ? "" : likeLength}
            </Box>
            
          )}
        </Box>
      </Card>
    </ThemeProvider>
  );
}
