import React from "react";
import Login from "./Login";
import Main from "./Main";
import User from "./mainComponents/User";
import Me from "./mainComponents/Me";
import Chat from "./mainComponents/Chat";
import ChatText from "./mainComponents/ChatText";
import CreateBlog from "./mainComponents/CreateBlog";
import NotFound from "./NotFound";
import Registration from "./Registration";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

function App(props) {
  const [usersRoute, setUsersRoute] = React.useState(false);
  const [usersChatRoute, setUsersChatRoute] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  React.useEffect(() => {
    if (props.auth === true) {
      if (
        window.location.pathname.substring(0, 5) !== "/chat" &&
        window.location.pathname.substring(0, 5) !== "/" &&
        window.location.pathname.substring(0, 5) !== "/" + props.me.id
      ) {
        setLoading(true);
        const options = {
          method: "POST",
          url: "api/checkUser",
          data: { id: window.location.pathname.substring(1) },
          headers: { "Content-Type": "application/json" },
        };
        axios(options).then((msg) => {
          setLoading(false);
          if (msg.data.exists === true) {
            setUserName(msg.data.name);
            setUsersRoute(msg.data.exists);
          } else {
            setUsersRoute(msg.data.exists);
          }
        });
      }
    }
  }, []);
  React.useEffect(() => {
    if (props.auth === true) {
      if (window.location.pathname.substring(0, 6) === "/chat-") {
        setLoading(true);
        const options = {
          method: "POST",
          url: "api/checkUser",
          data: { id: window.location.pathname.split("-")[1] },
          headers: { "Content-Type": "application/json" },
        };
        axios(options).then((msg) => {
          setLoading(false);
          if (msg.data.exists === true) {
            setUserName(msg.data.name);
            setUsersChatRoute(msg.data.exists);
          } else {
            setUsersChatRoute(msg.data.exists);
          }
        });
      }
    }
  },[]);
  function ProtectedRoute() {
    if (props.auth === true) {
      return (
        <Router>
          <Switch>
            <Route exact path="/">
              <Main
                dark={props.dark}
                me={props.me}
                blogs={props.blogs}
                socket={props.socket}
              />
            </Route>
            <Route path="/login">
              <Redirect to="/" />
            </Route>
            <Route path="/registration">
              <Redirect to="/" />
            </Route>
            <Route path={"/" + props.me.id}>
              <Me dark={props.dark} me={props.me} socket={props.socket} />
            </Route>
            <Route path="/createBlog">
              <CreateBlog
                dark={props.dark}
                socket={props.socket}
                me={props.me}
              />
            </Route>
            <Route path={"/chat"}>
              <Chat dark={props.dark} me={props.me} socket={props.socket} />
            </Route>
            {usersChatRoute === true && (
              <Route path={window.location.pathname}>
                <ChatText
                  dark={props.dark}
                  me={props.me}
                  user={{
                    name: userName,
                    id: window.location.pathname.split("-")[1],
                  }}
                  socket={props.socket}
                />
              </Route>
            )}
            {usersRoute === true ? (
              <Route path={window.location.pathname}>
                <User
                  dark={props.dark}
                  userName={userName}
                  me={props.me}
                  socket={props.socket}
                />
              </Route>
            ) : (
              <div>
                {loading === false && (
                  <Route path={window.location.pathname}>
                    <NotFound dark={props.dark} />
                  </Route>
                )}
              </div>
            )}

            
            
            <Route path="/404">
              <NotFound dark={props.dark} />
            </Route>
            <Backdrop open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            {loading === false && (
              <Route path="*">
                <NotFound dark={props.dark} />
              </Route>
            )}
          </Switch>
        </Router>
      );
    } else {
      return (
        <Router>
          <Switch>
            <Route exact path="/registration">
              <Registration />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route>
              <Redirect to="/login" />
            </Route>
          </Switch>
        </Router>
      );
    }
  }

  return <ProtectedRoute />;
}

export default App;
