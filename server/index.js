// server/index.js
require("dotenv").config();

const express = require("express");

const PORT = process.env.PORT || 3001;

var fs = require("fs");

var multer = require("multer");

const app = express();

const server= require("http").Server(app);



const path = require("path");

const passport = require("passport");

const session = require("express-session");

// const socket = require("socket.io");

const mongoose = require("mongoose");

const MongoStore = require('connect-mongo');

const passportLocalMongoose = require("passport-local-mongoose");

const encrypt = require("mongoose-encryption");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    expires: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://admin-darsala:@cluster0.md00x.mongodb.net/chatAppDB' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, "../client/build")));

mongoose.connect(
  "mongodb+srv://admin-darsala:@cluster0.md00x.mongodb.net/chatAppDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

mongoose.set("useCreateIndex", true);

const commentSchema = new mongoose.Schema({
  commentUserId: String,
  commentUserName: String,
  likes: Array,
  text: String,
  time: Date,
});

const blogSchema = new mongoose.Schema({
  authorId: { type: String, index: true },
  authorName: String,
  title: String,
  content: String,
  likes: Array,
  img: {
    data: Buffer,
    contentType: String,
  },
  time: Date,
  comments: [commentSchema],
});

const follSchema = new mongoose.Schema({
  id: String,
  name: String,
});

const userSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId() },
  password: String,
  fName: { type: String, index: true },
  lName: { type: String, index: true },
  email: { type: String, unique: true, lowercase: true },
  followers: [follSchema],
  followings: [follSchema],
  darkMode: Boolean,
});

const singleChatSchema = new mongoose.Schema({
  user: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  like: Array,
  text: String,
  time: Date,
});
const chatSchema = new mongoose.Schema({
  firstUser: { type: String, index: true },
  firstUserName: String,
  firstSeen: Boolean,
  secondSeen: Boolean,
  secondUserName: String,
  secondUser: { type: String, index: true },
  text: [singleChatSchema],
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  passwordField: "password",
});
singleChatSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["text"],
  requireAuthenticationCode: false,
});
const User = new mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Chat = mongoose.model("Chat", chatSchema);
const SingleChat = mongoose.model("SingleChat", singleChatSchema);
var socketConnections = [];

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, 'uploads'));
    
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });



passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
(function () {
  if (typeof Object.defineProperty === "function") {
    try {
      Object.defineProperty(Array.prototype, "sortBy", { value: sb });
    } catch (e) {}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f) {
    for (var i = this.length; i; ) {
      var o = this[--i];
      this[i] = [].concat(f.call(o, o, i), o);
    }
    this.sort(function (a, b) {
      for (var i = 0, len = a.length; i < len; ++i) {
        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
      }
      return 0;
    });
    for (var i = this.length; i; ) {
      this[--i] = this[i][this[i].length - 1];
    }
    return this;
  }
})();

User.find({}, (err, user) => {
  if (err) {
    console.log(err);
  } else if (user) {
    if (user.length === 0) {
      User.register(
        {
          _id: 1,
          fName: "Luka",
          lName: "Darsalia",
          email: "Lukadarsalia13@gmail.com",
          darkMode: true,
        },
        process.env.PASSWORD
      );
    }
  } else if (typeof user !== "undefined") {
    User.register(
      {
        _id: 1,
        fName: "Luka",
        lName: "Darsalia",
        email: "Lukadarsalia13@gmail.com",
        darkMode: true,
      },
      process.env.PASSWORD
    );
  }
});

function exists(arr, search) {
  return arr.some((row) => row.includes(search));
}

app.get("/api", (req, res) => {
  res.json({ auth: req.isAuthenticated() });
});

app.post("/api/login", (req, res) => {
  const email = req.body.email.toLowerCase();
  User.findOne({ email: email }, function (err, u) {
    if (err) {
      console.log(err);
    } else {
      if (u) {
        u.authenticate(req.body.pass, (err, model, info) => {
          if (info) {
            res.json({ warning: "Wrong email or password!" });
          }
          if (err) {
            console.log(err);
          } else if (model) {
            req.login(u, (err) => {
              if (err) {
                console.log(err);
              } else {
                passport.authenticate("local");
                req.session.save((error) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({ auth: req.isAuthenticated() });
                  }
                });
              }
            });
          }
        });
      } else {
        res.json({ warning: "Wrong email or password!" });
      }
    }
  });
});

app.post("/api/register", (req, res) => {
  let usersItems = [];
  for (const property in req.body) {
    {
      usersItems.push(req.body[property]);
    }
  }

  let [fName, lName, email, pass] = usersItems;
  User.find({ email: email }, function (err, docs) {
    if (docs.length === 0) {
      warning = "";
      fName = fName[0].toUpperCase() + fName.substring(1);
      lName = lName[0].toUpperCase() + lName.substring(1);
      User.register(
        {
          fName: fName,
          lName: lName,
          email: email,
          darkMode: false,
        },
        pass,
        function (err, user) {
          if (err) {
            console.log(err);
          } else {
            req.login(user, (err) => {
              if (err) {
                console.log(err);
              } else {
                passport.authenticate("local");
                req.session.save((error) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({ auth: req.isAuthenticated() });
                  }
                });
              }
            });
          }
        }
      );
    } else {
      res.json({ warning: "The accout already exists!" });
    }
  });
});
app.get("/api/darkMode", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.session.passport.user }, (err, u) => {
      res.json({
        darkMode: u.darkMode,
      });
    });
  }
});

app.post("/api/checkUser", (req, res)=>{
  if(req.isAuthenticated()){
    User.findOne({_id: req.body.id}, (err, data)=>{
      if(err){
        console.log(err);
      }else{
        if(data){
          if(data.length !== 0){
            res.json({exists:true, name: data.fName + " " + data.lName});
          }else{
            res.json({exists:false});
          }
        }else{
          res.json({exists:false});
        }
      }
    });
  }
});


app.get("/api/search", (req, res) => {
  User.find({}, (err, u) => {
    if (err) {
      console.log(err);
    } else {
      const data = [];
      u.forEach((singleU) => {
        const name = singleU.fName + " " + singleU.lName;
        const id = singleU._id.toString();
        data.push({ name: name, id: id });
      });
      res.json(data);
    }
  });
});

app.post("/api/darkMode", (req, res) => {
  User.findOne({ _id: req.session.passport.user }, (err, u) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      u.darkMode = req.body.darkMode;
      u.save();
    }
  });
  res.end();
});

app.get("/api/me", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.session.passport.user }, (err, u) => {
      const id = u._id.toString();
      const name = u.fName + " " + u.lName;
      res.json({
        id: id,
        name: name,
      });
    });
  }
});

app.post("/api/followers", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.body.id }, (err, user) => {
      if (err) {
        console.log(err);
        res.end();
      } else {
        if (user) {
          const id = user._id.toString();
          let data = {
            id: id,
            followers: user.followers,
            followings: user.followings,
          };

          res.json(data);
        }
      }
    });
  }
});

app.get("/api/timeline", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.session.passport.user }, (err, u) => {
      if (err) {
        console.log(err);
      } else {
        if (u) {
          var followingsData = u.followings;
          var followings = [];
          followingsData.forEach((i) => {
            followings.push(i.id);
          });

          Blog.find({ authorId: { $in: followings } }, (error, blogs) => {
            if (error) {
              console.log(error);
            } else {
              if (blogs) {
                blogs
                  .sortBy(function (o) {
                    return o.time;
                  })
                  .reverse();
                if (blogs.length > 10) {
                  res.json([blogs.slice(0, 10), false]);
                } else {
                  res.json([blogs, true]);
                }
              }
            }
          });
        }
      }
    });
  }
});

app.get("/api/myBlogs", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.find({ authorId: req.session.passport.user }, (err, blogs) => {
      if (err) {
        console.log(err);
      } else {
        if (blogs) {
          blogs
            .sortBy(function (o) {
              return o.time;
            })
            .reverse();
          if (blogs.length > 10) {
            res.json([blogs.slice(0, 10), false]);
          } else {
            res.json([blogs, true]);
          }
        }
      }
    });
  }
});

app.post("/api/usersBlogs", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.find({ authorId: req.body.id }, (err, blogs) => {
      if (err) {
        console.log(err);
      } else {
        if (blogs) {
          blogs
            .sortBy(function (o) {
              return o.time;
            })
            .reverse();
          if (blogs.length > 10) {
            res.json([blogs.slice(0, 10), false]);
          } else {
            res.json([blogs, true]);
          }
        }
      }
    });
  }
});


app.post("/api/blogs", upload.single("image"), (req, res) => {
  if (req.isAuthenticated()) {
    if (req.file !== undefined) {
      var img = {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      };
      Blog.create(
        {
          authorId: req.session.passport.user,
          authorName: req.body.name,
          title: req.body.title,
          content: req.body.content,
          img: img,
          time: new Date(),
        },
        (err, docs) => {
          if (err) {
            console.log(err);
          }
          res.end();
        }
      );
      fs.unlink(
        path.join(__dirname + "/uploads/" + req.file.filename),
        (err) => {
          if (err) {
            console.error(err);
            return;
          }

          //file removed
        }
      );
    } else {
      Blog.create(
        {
          authorId: req.session.passport.user,
          authorName: req.body.name,
          title: req.body.title,
          content: req.body.content,
          time: new Date(),
        },
        (err, docs) => {
          if (err) {
            console.log(err);
          }
          res.end();
        }
      );
    }
  }
});

app.post("/api/blogsDelete", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.deleteOne({ _id: req.body.id }, (err) => {
      if (err) {
        console.log(err);
      }
      res.end();
    });
  }
});

app.post("/api/comment", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOne({ _id: req.body.blogId }, (err, blog) => {
      if (err) {
        console.log(err);
      } else {
        const d = new Date();
        const comment = {
          commentUserId: req.body.myId,
          commentUserName: req.body.myName,
          text: req.body.text,
          time: d,
        };
        blog.comments.push(comment);
        blog.save();
        res.end();
      }
    });
  }
});



app.post("/api/commentDelete", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOne({ _id: req.body.blogId }, (err, blog) => {
      if (err) {
        console.log(err);
      } else {
        blog.comments.forEach((m) => {
          if (m._id.toString() === req.body.commentId) {
            const index = blog.comments.indexOf(m);
            if (index > -1) {
              blog.comments.splice(index, 1);
            }
            blog.save();
            res.end();
          }
        });
      }
    });
  }
});

app.post("/api/like", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOne({ _id: req.body.blogId }, (err, blog) => {
      if (blog.likes.includes(req.body.me) === false) {
        blog.likes.push(req.body.me);
        blog.save();
        res.end();
      } else {
        res.end();
      }
    });
  }
});

app.post("/api/unlike", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOne({ _id: req.body.blogId }, (err, blog) => {
      const index = blog.likes.indexOf(req.body.me);
      if (index > -1) {
        blog.likes.splice(index, 1);
      }
      blog.save();
      res.end();
    });
  }
});
app.post("/api/likeComment", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOne({ _id: req.body.blogId }, (err, blog) => {
      blog.comments.forEach((i) => {
        if (i._id.toString() === req.body.commentId.toString()) {
          if (i.likes.includes(req.body.me) === false) {
            i.likes.push(req.body.me);
            blog.save();
            res.end();
          } else {
            res.end();
          }
        }
      });
    });
  }
});

app.post("/api/unlikeComment", (req, res) => {
  if (req.isAuthenticated()) {
    Blog.findOne({ _id: req.body.blogId }, (err, blog) => {
      blog.comments.forEach((i) => {
        if (i._id.toString() === req.body.commentId.toString()) {
          const index = i.likes.indexOf(req.body.me);
          if (index > -1) {
            i.likes.splice(index, 1);
          }
          blog.save();
          res.end();
        }
      });
    });
  }
});

app.post("/api/follow", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.body.id }, (err, u) => {
      if (err) {
        console.log(err);
      } else {
        if (u.followers.some((e) => e.id === req.body.me) === false) {
          u.followers.push({ id: req.body.me, name: req.body.myName });
        }
        const id = u._id.toString();
        let data = {
          id: id,
          followers: u.followers,
          followings: u.followings,
        };
        User.findOne({ _id: req.session.passport.user }, (err, user) => {
          if (user.followings.some((e) => e.id === req.body.id) === false) {
            user.followings.push({ id: req.body.id, name: req.body.name });
          }
          u.save();
          user.save();
          res.json(data);
        });
      }
    });
  }
});

app.post("/api/unfollow", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ _id: req.body.id }, (err, u) => {
      if (err) {
        console.log(err);
      } else {
        const index = u.followers.some(
          (e) => e.id === req.body.me && u.followers.indexOf(e)
        );
        if (index > -1) {
          u.followers.splice(index, 1);
        }
        const id = u._id.toString();
        let data = {
          id: id,
          followers: u.followers,
          followings: u.followings,
        };
        User.findOne({ _id: req.session.passport.user }, (err, user) => {
          const index = user.followings.some(
            (e) => e.id === req.body.id && user.followings.indexOf(e)
          );
          if (index > -1) {
            user.followings.splice(index, 1);
          }
          u.save();
          user.save();
          res.json(data);
        });
      }
    });
  }
});

app.post("/api/send", upload.single("image"), (req, res) => {
  if (req.isAuthenticated()) {
    const d = new Date();
    Chat.findOne(
      {
        $or: [
          { firstUser: req.session.passport.user, secondUser: req.body.id },
          { firstUser: req.body.id, secondUser: req.session.passport.user },
        ],
      },
      (err, u) => {
        if (err) {
          console.log(err);
        } else {
          if (u) {
            if (u.firstUser === req.session.passport.user) {
              if (req.file !== undefined) {
                var img = {
                  data: fs.readFileSync(
                    path.join(__dirname + "/uploads/" + req.file.filename)
                  ),
                  contentType: "image/png",
                };
                u.secondSeen = false;
                u.text.push({
                  user: req.session.passport.user,
                  img: img,
                  like: [],
                  time: d,
                });
                u.save((error, result) => {
                  console.log(result.text[result.text.length - 1]._id);
                  res.json({ id: result.text[result.text.length - 1]._id });
                });
                fs.unlink(
                  path.join(__dirname + "/uploads/" + req.file.filename),
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }

                    //file removed
                  }
                );
              } else {
                u.secondSeen = false;
                u.text.push({
                  user: req.session.passport.user,
                  text: req.body.text,
                  like: [],
                  time: d,
                });
                u.save((error, result) => {
                  console.log(result.text[result.text.length - 1]._id);
                  res.json({ id: result.text[result.text.length - 1]._id });
                });
              }
            } else {
              if (req.file !== undefined) {
                var img = {
                  data: fs.readFileSync(
                    path.join(__dirname + "/uploads/" + req.file.filename)
                  ),
                  contentType: "image/png",
                };
                u.firstSeen = false;
                u.text.push({
                  user: req.session.passport.user,
                  img: img,
                  like: [],
                  time: d,
                });
                u.save((error, result) => {
                  console.log(result.text[result.text.length - 1]._id);
                  res.json({ id: result.text[result.text.length - 1]._id });
                });
                fs.unlink(
                  path.join(__dirname + "/uploads/" + req.file.filename),
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }

                    //file removed
                  }
                );
              } else {
                u.firstSeen = false;
                u.text.push({
                  user: req.session.passport.user,
                  text: req.body.text,
                  like: [],
                  time: d,
                });
                u.save((error, result) => {
                  console.log(result.text[result.text.length - 1]._id);
                  res.json({ id: result.text[result.text.length - 1]._id });
                });
              }
            }
          } else {
            if (req.file !== undefined) {
              var img = {
                data: fs.readFileSync(
                  path.join(__dirname + "/uploads/" + req.file.filename)
                ),
                contentType: "image/png",
              };
              const chat = new Chat({
                firstUser: req.session.passport.user,
                firstUserName: req.body.name,
                secondUser: req.body.id,
                secondUserName: req.body.userName,
                firstSeen: true,
                secondSeen: false,
                text: {
                  user: req.session.passport.user,
                  img: img,
                  like: [],
                  time: d,
                },
              });
              fs.unlink(
                path.join(__dirname + "/uploads/" + req.file.filename),
                (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }

                  //file removed
                }
              );

              chat.save((error, result) => {
                res.json({ id: result.text[result.text.length - 1]._id });
              });
            } else {
              const chat = new Chat({
                firstUser: req.session.passport.user,
                firstUserName: req.body.name,
                secondUser: req.body.id,
                firstSeen: true,
                secondUserName: req.body.userName,
                secondSeen: false,
                text: {
                  user: req.session.passport.user,
                  text: req.body.text,
                  like: [],
                  time: d,
                },
              });

              chat.save((error, result) => {
                res.json({ id: result.text[result.text.length - 1]._id });
              });
            }
          }
        }
      }
    );
  }
});

app.get("/api/chatHeads", (req, res) => {
  if (req.isAuthenticated()) {
    let data = [];
    let cond = null;
    var as = 0;
    Chat.find(
      {
        $or: [
          { firstUser: req.session.passport.user },
          { secondUser: req.session.passport.user },
        ],
      },
      (err, chats) => {
        if (err) {
          console.log(err);
        } else {
          if (chats) {
            var id = "";
            chats.map((chat, i) => {
              chat.firstUser === req.session.passport.user
                ? (cond = chat.firstSeen)
                : (cond = chat.secondSeen);
              chat.firstUser === req.session.passport.user
                ? (id = chat.secondUser)
                : (id = chat.firstUser);
              let lastText = "";
              let myName;
              let onesName;
              if (chat.firstUser === req.session.passport.user) {
                myName = chat.firstUserName;
                onesName = chat.secondUserName;
              } else {
                myName = chat.secondUserName;
                onesName = chat.firstUserName;
              }
              if (
                chat.text[chat.text.length - 1].user ===
                req.session.passport.user
              ) {
                if (chat.text[chat.text.length - 1].text !== undefined) {
                  lastText = "You: " + chat.text[chat.text.length - 1].text;
                } else {
                  lastText = "You sent a photo";
                }
              } else {
                if (chat.text[chat.text.length - 1].text !== undefined) {
                  lastText = chat.text[chat.text.length - 1].text;
                } else {
                  lastText = onesName.split(" ")[0] + " sent you a photo";
                }
                as++;
              }
              data.push({
                lastText: lastText,
                id: id,
                cond: cond,
                name: onesName,
                time: chat.text[chat.text.length - 1].time,
              });
            });

            res.json(data);
            res.end();
          }
        }
      }
    );
  }
});

app.post("/api/wholeChat", (req, res) => {
  if (req.isAuthenticated()) {
    Chat.findOne(
      {
        $or: [
          { firstUser: req.session.passport.user, secondUser: req.body.id.id },
          { firstUser: req.body.id.id, secondUser: req.session.passport.user },
        ],
      },
      (err, chat) => {
        if (err) {
          console.log(err);
        } else {
          if (chat) {
            let cond = req.body.cond;
            chat.firstUser === req.session.passport.user
              ? (chat.firstSeen = true)
              : (chat.secondSeen = true);
            chat.save();
            if (chat.text.length > 20) {
              res.json({
                text: chat.text.slice(-20, chat.text.length),
                full: false,
              });
            } else {
              res.json({ text: chat.text, full: true });
            }

            res.end();
          } else {
            res.end();
          }
        }
      }
    );
  }
});

app.post("/api/likeMessage", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.body.id);
    Chat.findOne(
      { text: { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.id) } } },
      "text.$",
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            if (
              data.text[0].like.includes(req.session.passport.user) === false
            ) {
              console.log(data.text[0].like);
              data.text[0].like.push(req.session.passport.user);
              Chat.updateOne(
                {
                  text: {
                    $elemMatch: { _id: mongoose.Types.ObjectId(req.body.id) },
                    // 0 because the old record gets matched
                  },
                },
                { $set: { "text.$": data.text } },
                (err, u) => {
                  err ? console.log(err) : console.log(u);
                }
              );
              res.end();
            } else {
              res.end();
            }
          }
        }
      }
    );
  }
});

app.post("/api/unlikeMessage", (req, res) => {
  if (req.isAuthenticated()) {
    Chat.findOne(
      { text: { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.id) } } },
      "text.$",
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data) {
            const index = data.text[0].like.indexOf(req.session.passport.user);
            if (index > -1) {
              data.text[0].like.splice(index, 1);
            }
            Chat.updateOne(
              {
                text: {
                  $elemMatch: { _id: mongoose.Types.ObjectId(req.body.id) },
                  // 0 because the old record gets matched
                },
              },
              { $set: { "text.$": data.text } },
              (err, u) => {
                err ? console.log(err) : console.log(u);
              }
            );
            res.end();
          }
        }
      }
    );
  }
});

app.post("/api/getNames", (req, res) => {
  if (req.isAuthenticated()) {
    User.find(
      {
        $or: [
          { lName: { $regex: ".*^" + req.body.name + ".*", $options: "i" } },
          { fName: { $regex: ".*^" + req.body.name + ".*", $options: "i" } },
        ],
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          d=[];
          data.forEach(i=>{
            d.push({name: i.fName+" "+i.lName, id:i._id});
          })
          res.json(d)
        }
      }
    );
  }
});

app.post("/api/logout", function (req, res) {
  req.logout();
  req.session.destroy();
  res.end();
});

app.get("/api/seen", (req, res) => {
  if (req.isAuthenticated()) {
    Chat.find(
      {
        $or: [
          { firstUser: req.session.passport.user },
          { secondUser: req.session.passport.user },
        ],
      },
      (err, chats) => {
        if (err) {
          console.log(err);
        } else {
          if (chats) {
            let data = [];
            let cond = null;
            let name = "";
            chats.forEach((i) => {
              if (i.firstUser === req.session.passport.user) {
                cond = i.firstSeen;
                name = i.secondUser;
              } else {
                cond = i.secondSeen;
                name = i.firstUser;
              }
              data.push({ cond: cond, name: name });
            });
            res.json(data);
            res.end();
          }
        }
      }
    );
  }
});

app.post("/api/seen", (req, res) => {
  if (req.isAuthenticated()) {
    Chat.findOne(
      {
        $or: [
          {
            $and: [
              { firstUser: req.session.passport.user },
              { secondUser: req.body.id },
            ],
          },
          {
            $and: [
              { firstUser: req.body.id },
              { secondUser: req.session.passport.user },
            ],
          },
        ],
      },
      (err, chat) => {
        if (err) {
          console.log(err);
        } else {
          if (chat) {
            if (chat.firstUser === req.session.passport.user) {
              chat.firstSeen = true;
            } else {
              chat.secondSeen = true;
            }
            chat.save();
            res.end();
          }
        }
      }
    );
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports={server: server, User:User, Chat:Chat, Blog:Blog};

