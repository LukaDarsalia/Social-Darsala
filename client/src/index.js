import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import axios from "axios";
import { io } from "socket.io-client";

let data = [];
let dark = "";
let me = "";
let auth = null;

const optionAuth = {
  method: "get",
  url: "api",
  headers: { "Content-Type": "application/json" },
};
axios(optionAuth).then((res) => {
  if (res.data.auth === false) {
    auth = res.data.auth;
    ReactDOM.render(
      <App data={[]} me={""} dark={"dark"} auth={auth} />,
      document.getElementById("root")
    );
  } else {
    auth = res.data.auth;

    const option = {
      method: "GET",
      url: "api/me",
      headers: { "Content-Type": "application/json" },
    };
    axios(option).then((resMe) => {
      me = resMe.data;
      const optionDark = {
        method: "GET",
        url: "api/darkMode",
        headers: { "Content-Type": "application/json" },
      };
      axios(optionDark).then((res) => {
        res.data.darkMode ? (dark = "dark") : (dark = "light");
        let socket = io({
          transports: ["websocket"],
          upgrade: false,
        });
        if (window.location.pathname.substring(0, 6) === "/chat-") {
          socket.emit("chat-", { id: me.id, name: me.name });
        }
        ReactDOM.render(
          <App data={data} me={me} dark={dark} auth={auth} socket={socket} />,
          document.getElementById("root")
        );
      });
    });
  }
});
