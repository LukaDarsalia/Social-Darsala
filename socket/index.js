require("dotenv").config();
var serverSide = require("../server/index");

const io = require("socket.io")(serverSide.server, {
  transports: ["websocket"],
  upgrade: false,
  cors: { origin: "https://chat-app-darsala.herokuapp.com/" },
});
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


var _ = require("lodash");



const User = serverSide.User;
const Blog = serverSide.Blog;
const Chat = serverSide.Chat;


var socketConnections = [];
var socketChatConnections = [];
var i = {};
var b = {};
function exists(arr, search) {
  return arr.some((row) => row.includes(search));
}
function indexOfTwoD(arr, search) {
  var answer = null;
  arr.some((row) => {
    if (row.includes(search)) {
      answer = arr.indexOf(row);
    }
  });
  return answer;
}
io.on("connection", (socket) => {
  console.log("Connection established and id is " + socket.id);
  socket.on("id", (msg) => {
    if (!exists(socketConnections, msg.id)) {
      socketConnections.push([msg.id, socket.id, msg.name]);
    }
    if (socketConnections.length === 0) {
      socketConnections.push([msg.id, socket.id, msg.name]);
    } else {
      exists(socketConnections, msg.id)
        ? socketConnections.forEach((i) => {
            if (i[0] === msg.id) {
              i[1] = socket.id;
            }
          })
        : socketConnections.push([msg.id, socket.id, msg.name]);
    }
    console.log(socketConnections);
  });

  socket.on("newBlog", (msg) => {
    Blog.find({ authorId: msg.id }, (err, blogs) => {
      if (err) {
        console.log(err);
      } else {
        if (blogs) {
          if (blogs.length > 10 * msg.counter) {
            blogs
              .sortBy(function (o) {
                return o.time;
              })
              .reverse();
            socket.emit("getNewBlog", {
              blogs: blogs.slice(-10 * msg.counter, -10 * (msg.counter - 1)),
              full: false,
            });
          } else {
            socket.emit("getNewBlog", {
              blogs: blogs.slice(0, blogs.length - 10 * (msg.counter - 1)),
              full: true,
            });
          }
        }
      }
    });
  });

  socket.on("newTimeline", (msg) => {
    User.findOne({ _id: msg.id }, (err, u) => {
      if (err) {
        console.log(err);
      } else {
        if (u) {
          var followingsData = u.followings;
          var followings = [];
          followingsData.forEach((i) => {
            followings.push(i.id);
          });
          Blog.find({ authorId: { $in: followings } }, (err, blogs) => {
            if (err) {
              console.log(err);
            } else {
              if (blogs) {
                if (blogs.length > 10 * msg.counter) {
                  blogs
                    .sortBy(function (o) {
                      return o.time;
                    })
                    .reverse();
                  socket.emit("getNewTimeline", {
                    blogs: blogs.slice(
                      -10 * msg.counter,
                      -10 * (msg.counter - 1)
                    ),
                    full: false,
                  });
                } else {
                  socket.emit("getNewTimeline", {
                    blogs: blogs.slice(
                      0,
                      blogs.length - 10 * (msg.counter - 1)
                    ),
                    full: true,
                  });
                }
              }
            }
          });
        }
      }
    });
  });

  socket.on("chat-", (msg) => {
    if (!exists(socketChatConnections, msg.id)) {
      socketChatConnections.push([msg.id, socket.id, msg.name]);
    }
    if (socketChatConnections.length === 0) {
      socketChatConnections.push([msg.id, socket.id, msg.name]);
    } else {
      exists(socketChatConnections, msg.id)
        ? socketChatConnections.forEach((i) => {
            if (i[0] === msg.id) {
              i[1] = socket.id;
            }
          })
        : socketChatConnections.push([msg.id, socket.id, msg.name]);
    }
    console.log(socketChatConnections);
  });

  var filterBlog = [
    {
      $match: {
        "updateDescription.updatedFields.comments": {
          $exists: true,
        },
      },
    },
  ];
  var optionsBlog = { fullDocument: "updateLookup" };
  const changeStreamBlog = Blog.watch([], optionsBlog).on(
    "change",
    (change) => {
      if (change.updateDescription) {
        if (!change.updateDescription.updatedFields.likes) {
          if (!_.isEqual(i, change.fullDocument)) {
            io.emit("blogUpdate", change.fullDocument);
            i = change.fullDocument;
          }
        }
      }
    }
  );

  var filter = [
    {
      $match: {
        $or: [
          {
            "updateDescription.updatedFields.firstSeen": {
              $exists: true,
            },
          },
          {
            "updateDescription.updatedFields.secondSeen": {
              $exists: true,
            },
          },
        ],
      },
    },
  ];
  var options = { fullDocument: "updateLookup" };
  const changeStream = Chat.watch(filter, options).on("change", (change) => {
    console.log("haaaa");
    if (i.text === undefined) {
      console.log("now");
      if ("firstSeen" in change.updateDescription.updatedFields) {
        if (exists(socketConnections, change.fullDocument.firstUser)) {
          socketConnections.forEach((i) => {
            if (i[0] === change.fullDocument.firstUser) {
              if (change.updateDescription.updatedFields.firstSeen === false) {
                try {
                  io.to(i[1]).emit("seen", {
                    seen: change.fullDocument.firstSeen,
                    id: change.fullDocument.secondUser,
                    name: socketConnections[
                      indexOfTwoD(
                        socketConnections,
                        change.fullDocument.secondUser
                      )
                    ][2],
                  });
                } catch (error) {
                  console.log(error);
                }

                if (
                  exists(socketChatConnections, change.fullDocument.firstUser)
                ) {
                  try {
                    io.to(
                      socketChatConnections[
                        indexOfTwoD(
                          socketChatConnections,
                          change.fullDocument.firstUser
                        )
                      ][1]
                    ).emit("seen", {
                      seen: change.fullDocument.firstSeen,
                      id: change.fullDocument.secondUser,
                      name: socketChatConnections[
                        indexOfTwoD(
                          socketChatConnections,
                          change.fullDocument.secondUser
                        )
                      ][2],
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              } else {
                try {
                  io.to(i[1]).emit("seen", {
                    id: change.fullDocument.secondUser,
                    seen: change.fullDocument.firstSeen,
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            }
          });
        }
      }

      if ("secondSeen" in change.updateDescription.updatedFields) {
        if (exists(socketConnections, change.fullDocument.secondUser)) {
          socketConnections.forEach((i) => {
            if (i[0] === change.fullDocument.secondUser) {
              if (change.updateDescription.updatedFields.secondSeen === false) {
                try {
                  io.to(i[1]).emit("seen", {
                    seen: change.fullDocument.secondSeen,
                    id: change.fullDocument.firstUser,
                    name: socketConnections[
                      indexOfTwoD(
                        socketConnections,
                        change.fullDocument.firstUser
                      )
                    ][2],
                  });
                } catch (error) {
                  console.log(error);
                }

                if (
                  exists(socketChatConnections, change.fullDocument.secondUser)
                ) {
                  try {
                    io.to(
                      socketChatConnections[
                        indexOfTwoD(
                          socketChatConnections,
                          change.fullDocument.secondUser
                        )
                      ][1]
                    ).emit("seen", {
                      seen: change.fullDocument.secondSeen,
                      id: change.fullDocument.firstUser,
                      name: socketChatConnections[
                        indexOfTwoD(
                          socketChatConnections,
                          change.fullDocument.firstUser
                        )
                      ][2],
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              } else {
                try {
                  io.to(i[1]).emit("seen", {
                    id: change.fullDocument.firstUser,
                    seen: change.fullDocument.secondSeen,
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            }
          });
        }
      }
    } else {
      if (i.text.length !== change.fullDocument.text.length) {
        console.log("now");
        if ("firstSeen" in change.updateDescription.updatedFields) {
          if (exists(socketConnections, change.fullDocument.firstUser)) {
            socketConnections.forEach((i) => {
              if (i[0] === change.fullDocument.firstUser) {
                if (
                  change.updateDescription.updatedFields.firstSeen === false
                ) {
                  try {
                    io.to(i[1]).emit("seen", {
                      seen: change.fullDocument.firstSeen,
                      id: change.fullDocument.secondUser,
                      name: socketConnections[
                        indexOfTwoD(
                          socketConnections,
                          change.fullDocument.secondUser
                        )
                      ][2],
                    });
                  } catch (error) {
                    console.log(error);
                  }

                  if (
                    exists(socketChatConnections, change.fullDocument.firstUser)
                  ) {
                    try {
                      io.to(
                        socketChatConnections[
                          indexOfTwoD(
                            socketChatConnections,
                            change.fullDocument.firstUser
                          )
                        ][1]
                      ).emit("seen", {
                        seen: change.fullDocument.firstSeen,
                        id: change.fullDocument.secondUser,
                        name: socketChatConnections[
                          indexOfTwoD(
                            socketChatConnections,
                            change.fullDocument.secondUser
                          )
                        ][2],
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }
                } else {
                  try {
                    io.to(i[1]).emit("seen", {
                      id: change.fullDocument.secondUser,
                      seen: change.fullDocument.firstSeen,
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            });
          }
        }

        if ("secondSeen" in change.updateDescription.updatedFields) {
          if (exists(socketConnections, change.fullDocument.secondUser)) {
            socketConnections.forEach((i) => {
              if (i[0] === change.fullDocument.secondUser) {
                if (
                  change.updateDescription.updatedFields.secondSeen === false
                ) {
                  try {
                    io.to(i[1]).emit("seen", {
                      seen: change.fullDocument.secondSeen,
                      id: change.fullDocument.firstUser,
                      name: socketConnections[
                        indexOfTwoD(
                          socketConnections,
                          change.fullDocument.firstUser
                        )
                      ][2],
                    });
                  } catch (error) {
                    console.log(error);
                  }

                  if (
                    exists(
                      socketChatConnections,
                      change.fullDocument.secondUser
                    )
                  ) {
                    try {
                      io.to(
                        socketChatConnections[
                          indexOfTwoD(
                            socketChatConnections,
                            change.fullDocument.secondUser
                          )
                        ][1]
                      ).emit("seen", {
                        seen: change.fullDocument.secondSeen,
                        id: change.fullDocument.firstUser,
                        name: socketChatConnections[
                          indexOfTwoD(
                            socketChatConnections,
                            change.fullDocument.firstUser
                          )
                        ][2],
                      });
                    } catch (error) {
                      console.log(error);
                    }
                  }
                } else {
                  try {
                    io.to(i[1]).emit("seen", {
                      id: change.fullDocument.firstUser,
                      seen: change.fullDocument.secondSeen,
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            });
          }
        }
      }
    }

    i = change.fullDocument;
  });

  socket.on("sendText", (msg) => {
    let newMsg = {};
    if ("text" in msg) {
      newMsg = {
        _id: msg._id,
        text: msg.text,
        user: msg.myId,
        like: [],
        time: msg.date,
        name: msg.name,
        receiver: msg.id,
        receiverName: msg.userName,
      };
    } else {
      console.log(msg.filename);
      newMsg = {
        _id: msg._id,
        img: msg.filename,
        user: msg.myId,
        like: [],
        time: msg.date,
        name: msg.name,
        receiver: msg.id,
        receiverName: msg.userName,
      };
    }
    if (exists(socketChatConnections, msg.id)) {
      // socketChatConnections.some((row) => {
      //   if (row.includes(msg.id)) {

      //   }
      // });
      io.to(
        socketChatConnections[indexOfTwoD(socketChatConnections, msg.id)][1]
      ).emit("sendTextServer", newMsg);
    }
    let myMsg = {};
    if ("text" in msg) {
      myMsg = { _id: msg._id, text: msg.text, user: msg.myId, like: [], time: msg.date };
    } else {
      myMsg = { _id: msg._id, img: msg.filename, user: msg.myId, like: [], time: msg.date };
    }

    socket.emit("sendTextServer", myMsg);
    if (exists(socketConnections, msg.id)) {
      io.to(socketConnections[indexOfTwoD(socketConnections, msg.id)][1]).emit(
        "sendTextServer",
        newMsg
      );
    }

    io.to(socketConnections[indexOfTwoD(socketConnections, msg.myId)][1]).emit(
      "sendTextServer",
      newMsg
    );
  });

  socket.on("newChat", (msg) => {
    Chat.findOne(
      {
        $or: [
          { firstUser: msg.myId, secondUser: msg.id },
          { firstUser: msg.id, secondUser: msg.myId },
        ],
      },
      (err, chat) => {
        if (err) {
          console.log(err);
        } else {
          if (chat) {
            if (chat.text.length > 20 * msg.counter) {
              socket.emit("getNewChat", {
                text: chat.text.slice(
                  -20 * msg.counter,
                  -20 * (msg.counter - 1)
                ),
                full: false,
              });
            } else {
              socket.emit("getNewChat", {
                text: chat.text.slice(
                  0,
                  chat.text.length - 20 * (msg.counter - 1)
                ),
                full: true,
              });
            }
          }
        }
      }
    );
  });

  socket.on("likeMessage", (msg) => {
    try {
      if (exists(socketChatConnections, msg.userId)) {
        io.to(
          socketChatConnections[
            indexOfTwoD(socketChatConnections, msg.userId)
          ][1]
        ).emit("likeMessageUpdate", { textId: msg.id, liker: msg.me });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("unlikeMessage", (msg) => {
    try {
      if (exists(socketChatConnections, msg.userId)) {
        io.to(
          socketChatConnections[
            indexOfTwoD(socketChatConnections, msg.userId)
          ][1]
        ).emit("unlikeMessageUpdate", { textId: msg.id, unliker: msg.me });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("activeRequest", (msg)=>{
    console.log(msg.id);
    console.log(exists(socketConnections, msg.id));
    if(exists(socketConnections, msg.id)){
      socket.emit("activeResponse", {active:true});
    }
    
  });

  socket.on("disconnect", function () {
    socketConnections.forEach((i) => {
      if (i[1] === socket.id) {
        const index = socketConnections.indexOf(i);
        if (index > -1) {
          socketConnections.splice(index, 1);
        }
      }
    });
    console.log(socketConnections);

    socketChatConnections.forEach((i) => {
      if (i[1] === socket.id) {
        const index = socketChatConnections.indexOf(i);
        if (index > -1) {
          socketChatConnections.splice(index, 1);
        }
      }
    });
    console.log(socketChatConnections);
  });
});
