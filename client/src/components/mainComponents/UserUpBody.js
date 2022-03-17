import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";

export default function MyBody(props) {
  let color = "";
  props.dark === "dark" ? (color = "#026290") : (color = "#D93A34");
  const useStyles = makeStyles((theme) => ({
    Name: {
      display: "inline-flex",
      height: "max-content",
      marginLeft: "10px",
      marginRight: "20px",
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
      marginRight: "10px",
      marginLeft: "20px",
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
    },
    page: {
      width: "auto",
      [theme.breakpoints.up("sm")]: {
        width: "70%",
        margin: "auto",
      },
    },
    userAvatarBox: {
      display: "flex",
      alignItems: "center",
    },
  }));

  const classes = useStyles();
  const theme = createMuiTheme({
    typography: {
      fontFamily: ["Libre Baskerville", "sans-serif"].join(","),
    },
  });
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Box className={classes.page}>
          <Box className={classes.user}>
            <Box className={classes.userAvatarBox}>
              <Avatar className={classes.userAvatar}>{props.name[0]}</Avatar>
            </Box>
            <Typography className={classes.Name}>{props.name}</Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
