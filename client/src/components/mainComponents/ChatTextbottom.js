import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import "emoji-mart/css/emoji-mart.css";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import Button from "@material-ui/core/Button";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import imageCompression from "browser-image-compression";
import CloseIcon from "@material-ui/icons/Close";
import { Picker } from "emoji-mart";



export default function ChatTextBottom(props) {
    const useStyles = makeStyles((theme) => ({
        
        inputer: {
          width: "40%",
          [theme.breakpoints.up(300)]: {
            width: "50%",
          },
          [theme.breakpoints.up(350)]: {
            width: "58%",
          },
          [theme.breakpoints.up(415)]: {
            width: "65%",
          },
          [theme.breakpoints.up(450)]: {
            width: "68%",
          },
          [theme.breakpoints.up("sm")]: {
            width: "74%",
          },
          [theme.breakpoints.up(800)]: {
            width: "75%",
          },
          [theme.breakpoints.up(830)]: {
            width: "78%",
          },
          [theme.breakpoints.up(872)]: {
            width: "83%",
          },
          [theme.breakpoints.up(1140)]: {
            width: "85%",
          },
          [theme.breakpoints.up(1345)]: {
            width: "89%",
          },
        },
        
      }));
    const classes = useStyles();
    const [emoji, setEmoji] = React.useState(false);
    const inputRef = React.useRef();
    const [selectionStart, setSelectionStart] = React.useState();
    const updateSelectionStart = () =>
    setSelectionStart(inputRef.current.selectionStart);
    const [v, setV] = React.useState("");
    const [photo, setPhoto] = React.useState("");
    const [preview, setPreview] = React.useState("");
    const [condition, setCondition] = React.useState(false);
    const [placeHolder, setPlaceHolder] = React.useState("Type a message");
    return(
    <React.Fragment>
        {emoji === true && (
            <Picker
              set="facebook"
              defaultSkin={6}
              showPreview={false}
              theme="auto"
              perLine={8}
              title="Pick your emoji…"
              emoji="point_up"
              style={{ position: "absolute", bottom: "80px", right: "40px" }}
              onSelect={(emoji) => {
                var text = v;
                var i = text.split("");
                i.splice(selectionStart, 0, emoji.native);
                var a = i.join("");
                // document.getElementById("input").value = a;
                setV(a);
              }}
            />
          )}
          {preview !== "" && (
            <Box>
              <Button
                style={{
                  position: "absolute",
                  zIndex: 10,
                  marginLeft: "2px",
                  width: "25%",
                  marginTop: "3px",
                  height: "calc(100% - 6px)",
                  background: "rgb(0 12 32)",
                }}
                onClick={() => window.open(preview)}
              >
                Preview
              </Button>
              <Button
                style={{
                  position: "absolute",
                  top: "-11px",
                  left: "-11px",
                  minWidth: "0",
                  padding: "0",
                  zIndex: "99",
                }}
                onClick={() => {
                  setPhoto("");
                  setPreview("");
                  setPlaceHolder("Type a message");
                  setCondition(false);
                  document.getElementById("raised-button-file").value = "";
                }}
              >
                <CloseIcon style={{ color: "red" }} />
              </Button>
            </Box>
          )}
          <TextField
            id="input"
            className={classes.inputer}
            variant="outlined"
            label={placeHolder}
            disabled={condition}
            multiline
            value={v}
            onChange={(e) => {
              var val = e.target.value;
              setV(val);
            }}
            onSelect={updateSelectionStart}
            inputRef={inputRef}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                setV("");
                document.getElementById("send").click();

                e.preventDefault();
              }
            }}
            rowsMax={Infinity}
          ></TextField>

          <input
            accept="image/*"
            name="image"
            className={classes.input}
            hidden
            onChange={(evt) => {
              const val = evt.target.files[0];

              setPhoto(val);
              const [file] = evt.target.files;
              if (file) {
                setPreview(URL.createObjectURL(file));
                setPlaceHolder("");
                setCondition(true);
                setV("");
              }
            }}
            id="raised-button-file"
            type="file"
          />
          <label htmlFor="raised-button-file">
            <IconButton component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <IconButton onClick={() => setEmoji((prev) => !prev)}>
            <EmojiEmotionsIcon />
          </IconButton>

          <IconButton
            id="send"
            onClick={() => {
              if (photo === "") {
                if (v !== "") {
                  if (v.trim().length) {
                    let dataa = {
                      text: v,
                      id: window.location.pathname.split("-")[1],
                      myId: props.me.id,
                      name: props.me.name,
                      userName: props.user.name,
                      date: new Date(),
                    };
                    const option = {
                      method: "post",
                      url: "api/send",
                      data: dataa,
                      headers: { "Content-Type": "application/json" },
                    };

                    axios(option).then((msg) => {
                      const data = {
                        _id: msg.data.id,
                        text: v,
                        id: window.location.pathname.split("-")[1],
                        myId: props.me.id,
                        name: props.me.name,
                        userName: props.user.name,
                        date: new Date(),
                      };
                      props.socket.emit("sendText", data);
                      document.getElementById("input").value = "";
                      setV("");
                    });

                    
                  }
                }
              } else {
                var photoo = photo;
                setPhoto("");
                setPreview("");
                setPlaceHolder("Type a message");
                setCondition(false);
                const o = {
                  maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY)
                };
                imageCompression(photoo, o)
                  .then(function (compressedFile) {
                    var bodyFormData = new FormData();
                    bodyFormData.append("image", compressedFile);
                    bodyFormData.append(
                      "id",
                      window.location.pathname.split("-")[1]
                    );
                    bodyFormData.append("myId", props.me.id);
                    bodyFormData.append("name", props.me.name);
                    bodyFormData.append("userName", props.user.name);
                    bodyFormData.append("date", new Date());

                    const options = {
                      method: "post",
                      url: "api/send",
                      data: bodyFormData,
                    };
                    axios(options).then((msg) => {
                      const data = {
                        _id: msg.data.id,
                        id: window.location.pathname.split("-")[1],
                        myId: props.me.id,
                        name: props.me.name,
                        userName: props.user.name,
                        date: new Date(),
                        filename: compressedFile,
                      };

                      props.socket.emit("sendText", data);
                    });
                  })
                  .catch(function (error) {
                    console.log(error.message);
                  });
              }
            }}
          >
            <SendIcon />
          </IconButton>
    </React.Fragment>
    );
}