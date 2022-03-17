import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import validator from "validator";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "rgb(0, 20, 40)",
      paper: "rgb(10, 25, 41)",
    },
    divider: "rgb(10, 25, 41)",
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [emailhelperText, setEmailhelperText] = React.useState("");
  const [fNameV, setFNameV] = React.useState(false);
  const [lNameV, setLNameV] = React.useState(false);
  const [emailV, setEmailV] = React.useState(false);
  const passV = false;
  const [fName, setFName] = React.useState("");
  const [lName, setLName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [user, setUser] = React.useState({});

  function clickHandler(event) {
    if (validator.isEmail(email)) {
      if (validator.isAlpha(fName)) {
        if (validator.isAlpha(lName)) {
          setUser({
            fName: fName,
            lName: lName,
            email: email,
            pass: pass,
          });
        } else {
          setLNameV(true);
        }
      } else {
        setFNameV(true);
      }
    } else {
      setEmailV(true);
    }
    if (emailhelperText === "The accout already exists!") {
      setEmailV(false);
      setEmailhelperText("");
      setUser({
        fName: fName,
        lName: lName,
        email: email,
        pass: pass,
      });
    }
    event.preventDefault();
    return user;
  }
  React.useEffect(() => {
    if (Object.keys(user).length !== 0) {
      const options = {
        method: "post",
        url: "api/register",
        data: user,
        headers: { "Content-Type": "application/json" },
      };
      axios(options).then((res) => {
        setUser({});
        if (res.data.auth === true) {
          window.location.reload();
        }
        if (res.data.warning === "The accout already exists!") {
          setEmailV(true);
          setEmailhelperText("The accout already exists!");
        } else {
          setEmailV(false);
          setEmailhelperText("");
        }
      });
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={fNameV}
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={fName}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFName(value);
                  }}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={lNameV}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={lName}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLName(value);
                  }}
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={emailV}
                  helperText={emailhelperText}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    const value = event.target.value;
                    setEmail(value);
                  }}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={passV}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={pass}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPass(value);
                  }}
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              onClick={clickHandler}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
