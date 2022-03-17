import React from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function CreateBlogBody(props) {
  const [title, setTitle] = React.useState("");
  const history = useHistory();
  const [content, setContent] = React.useState("");
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const useStyles = makeStyles((theme) => ({
    Page: {
      width: "100%",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      [theme.breakpoints.up("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.up("md")]: {
        width: "70%",
      },
    },
    Inputs: {
      width: "80%",
      marginTop: "20px",
      [theme.breakpoints.up("sm")]: {
        width: "70%",
      },
      [theme.breakpoints.up("md")]: {
        width: "60%",
      },
    },
  }));

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  function handleClick(event) {
    if (content !== "") {
      if (content.trim().length) {
        var bodyFormData = new FormData();
        bodyFormData.append("name", props.me.name);
        bodyFormData.append("content", content);
        bodyFormData.append("title", title);
        bodyFormData.append("image", va);
        const options = {
          method: "post",
          url: "api/blogs",
          data: bodyFormData,
          // headers: { "Content-Type":'multipart/form-data'},
        };
        axios(options).then((res) => {
          history.push("/");
          window.location.reload();
        });
      }
    }
  }
  const [va, setVa] = React.useState("");
  const [v, setV] = React.useState("");
  function chang(evt) {
    const val = evt.target.files[0];
    setVa(val);
    const [file] = evt.target.files;
    if (file) {
      setV(URL.createObjectURL(file));
    }
  }
  const classes = useStyles();
  return (
    <React.Fragment>
      <Box className={classes.Page}>
        <FormControl variant="outlined" className={classes.Inputs}>
          <InputLabel htmlFor="component-outlined" style={{ fontSize: "20px" }}>
            Title (Optional)
          </InputLabel>
          <OutlinedInput
            id="component-outlined"
            value={title}
            onChange={handleChange}
            style={{ fontSize: "20px" }}
            label="Title (Optional)"
          />
        </FormControl>
        <TextField
          label="Content"
          variant="outlined"
          multiline
          required
          rows={10}
          rowsMax={Infinity}
          value={content}
          onChange={handleContentChange}
          InputProps={{ style: { fontSize: 20 } }}
          InputLabelProps={{ style: { fontSize: 20, margin: "auto" } }}
          className={classes.Inputs}
        ></TextField>

        <input
          accept="image/*"
          name="image"
          className={classes.input}
          hidden
          id="raised-button-file"
          onChange={chang}
          type="file"
        />
        <label style={{marginTop:"20px"}} htmlFor="raised-button-file">
          <Button
            variant="outlined"
            component="span"
            className={classes.button}
          >
            Upload Image (Optional)
          </Button>
          {v !== "" && <Button onClick={() => window.open(v)}>Preview</Button>}
        </label>
        <Box className={classes.Inputs}>
          <Button variant="outlined" onClick={handleClick}>
            Post
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  );
}
