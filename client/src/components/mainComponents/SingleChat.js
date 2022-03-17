/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

export default function SingleChat(props) {
  const [fullMode, setFullMode] = React.useState(false);
  const [appear, setAppear] = React.useState(false);
  const [like, setLike] = React.useState(props.likes.includes(props.me.id));
  const [likeLength, setLikeLength] = React.useState(props.likes.length);
  const useStyles = makeStyles((theme) => ({
    like: {
      fontSize: "20px",

      "&:hover": {
        filter: "contrast(0.5)",
        cursor: "pointer",
      },
    },
    likeBox:{
      position: "relative",
      marginLeft:"20px",
      marginBottom:"2px",
      marginTop: "-5px",
      color:"#e91e63"
    }
  }));
  const classes = useStyles();

  React.useEffect(()=>{
    props.socket.on("likeMessageUpdate", (msg)=>{
      if(msg.liker!==props.me.id){
        if(props.id===msg.textId){
          setLikeLength((prev)=>prev + 1);
        }
      }
    });
    props.socket.on("unlikeMessageUpdate", (msg)=>{
      if(msg.unliker!==props.me.id){
        if(props.id===msg.textId){
          setLikeLength((prev)=>prev - 1);
        }
      }
    });
  }, []);
  function handleLikeClick(event) {
    if (like === false) {
      const data = {
        id: props.id,
        index: props.index,
        userId: props.userId,
        me: props.me.id,
      };
      const options = {
        method: "post",
        url: "api/likeMessage",
        data: data,
        headers: { "Content-Type": "application/json" },
      };
      axios(options).then(() => {
        setLike(true);
        setLikeLength(likeLength + 1);
      });
      
      props.socket.emit("likeMessage", data);
    } else {
      const data = {
        id: props.id,
        index: props.index,
        userId: props.userId,
        me: props.me.id,
      };
      const options = {
        method: "post",
        url: "api/unlikeMessage",
        data: data,
        headers: { "Content-Type": "application/json" },
      };
      axios(options).then(() => {
        setLike(false);
        setLikeLength(likeLength - 1);
      });
      props.socket.emit("unlikeMessage", data);
    }
  }
  try {
    return (
      <React.Fragment>
        {props.me.id === props.user ? (
          <Box
            onMouseEnter={() => setAppear(true)}
            onMouseLeave={() => setAppear(false)}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {appear === true && (
              <Box>
                {like === false ? (
                  <Box>
                    <FavoriteBorderIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                ) : (
                  <Box>
                    <FavoriteIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                )}
              </Box>
            )}

            <Card
              onDoubleClick={handleLikeClick}
              style={{
                maxWidth: "50%",
                margin: { likeLength } === 0 ? "2px 20px" : "5px 20px",
                borderRadius: "20px",
              }}
            >
              <CardContent style={{ paddingBottom: "10px", padding: "10px" }}>
                {props.img !== undefined ? (
                  <Box>
                    {fullMode === false ? (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "zoom-in",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    ) : (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          background:
                            "RGBA(0,0,0,1)",
                          backgroundSize: "contain",
                          width: "100%",
                          height: "100%",
                          position: "fixed",
                          zIndex: "10000",
                          objectFit:"contain",
                          top: "0",
                          left: "0",
                          cursor: "zoom-out",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography
                    style={{ margin: "0 10px", wordBreak: "break-word" }}
                  >
                    {props.text}
                  </Typography>
                )}
              </CardContent>
              {likeLength !== 0 && (
                <Box>
                  {likeLength === 1 ? (
                    <Box
                      className={classes.likeBox}
                      
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                    </Box>
                  ) : (
                    <Box
                    className={classes.likeBox}
                      
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                      <Box
                        style={{
                          display: "contents",
                          fontSize: "10px",
                        }}
                      >
                        {likeLength}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Card>
          </Box>
        ) : (
          <Box
            onMouseEnter={() => setAppear(true)}
            onMouseLeave={() => setAppear(false)}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Card
              onDoubleClick={handleLikeClick}
              style={{
                maxWidth: "50%",
                margin: { likeLength } === 0 ? "2px 20px" : "5px 20px",
                borderRadius: "20px",
              }}
            >
              <CardContent style={{ paddingBottom: "10px", padding: "10px" }}>
                {props.img !== undefined ? (
                  <Box>
                    {fullMode === false ? (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "zoom-in",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    ) : (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          background:
                            "RGBA(0,0,0,1)",
                          backgroundSize: "contain",
                          width: "100%",
                          height: "100%",
                          position: "fixed",
                          objectFit:"contain",
                          zIndex: "10000",
                          top: "0",
                          left: "0",
                          cursor: "zoom-out",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography
                    style={{ margin: "0 10px", wordBreak: "break-word" }}
                  >
                    {props.text}
                  </Typography>
                )}
              </CardContent>
              <Box style={{ display: "flex", justifyContent: "flex-start" }}>
              {likeLength !== 0 && (
                <Box>
                  {likeLength === 1 ? (
                    <Box
                    className={classes.likeBox}
                    
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                    </Box>
                  ) : (
                    <Box
                    className={classes.likeBox}
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                      <Box
                        style={{
                          display: "contents",
                          fontSize: "10px",
                        }}
                      >
                        {likeLength}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
                
              </Box>
            </Card>
            {appear === true && (
              <Box>
                {like === false ? (
                  <Box>
                    <FavoriteBorderIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                ) : (
                  <Box>
                    <FavoriteIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </React.Fragment>
    );
  } catch (error) {
    return (
      <React.Fragment>
        {props.me.id === props.user ? (
          <Box
            onMouseEnter={() => setAppear(true)}
            onMouseLeave={() => setAppear(false)}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {appear === true && (
              <Box>
                {like === false ? (
                  <Box>
                    <FavoriteBorderIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                ) : (
                  <Box>
                    <FavoriteIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                )}
              </Box>
            )}

            <Card
              onDoubleClick={handleLikeClick}
              style={{
                maxWidth: "50%",
                margin: { likeLength } === 0 ? "2px 20px" : "5px 20px",
                borderRadius: "20px",
              }}
            >
              <CardContent style={{ paddingBottom: "10px", padding: "10px" }}>
                {props.img !== undefined ? (
                  <Box>
                    {fullMode === false ? (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "zoom-in",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    ) : (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          background:
                            "RGBA(0,0,0,1)",
                          backgroundSize: "contain",
                          width: "100%",
                          height: "100%",
                          position: "fixed",
                          zIndex: "10000",
                          objectFit:"contain",
                          top: "0",
                          left: "0",
                          cursor: "zoom-out",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography
                    style={{ margin: "0 10px", wordBreak: "break-word" }}
                  >
                    {props.text}
                  </Typography>
                )}
              </CardContent>
              {likeLength !== 0 && (
                <Box>
                  {likeLength === 1 ? (
                    <Box
                    className={classes.likeBox}
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                    </Box>
                  ) : (
                    <Box
                    className={classes.likeBox}
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                      <Box
                        style={{
                          display: "contents",
                          fontSize: "10px",
                        }}
                      >
                        {likeLength}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Card>
          </Box>
        ) : (
          <Box
            onMouseEnter={() => setAppear(true)}
            onMouseLeave={() => setAppear(false)}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Card
              onDoubleClick={handleLikeClick}
              style={{
                maxWidth: "50%",
                margin: { likeLength } === 0 ? "2px 20px" : "5px 20px",
                borderRadius: "20px",
              }}
            >
              <CardContent style={{ paddingBottom: "10px", padding: "10px" }}>
                {props.img !== undefined ? (
                  <Box>
                    {fullMode === false ? (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "zoom-in",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    ) : (
                      <img
                        onClick={() => {
                          setFullMode((prev) => !prev);
                        }}
                        style={{
                          background:
                            "RGBA(0,0,0,1)",
                          backgroundSize: "contain",
                          objectFit:"contain",
                          width: "100%",
                          height: "100%",
                          position: "fixed",
                          zIndex: "10000",
                          top: "0",
                          left: "0",
                          cursor: "zoom-out",
                        }}
                        src={`data:image/${
                          props.img.contentType
                        };base64,${Buffer.from(props.img.data).toString(
                          "base64"
                        )}`}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography
                    style={{ margin: "0 10px", wordBreak: "break-word" }}
                  >
                    {props.text}
                  </Typography>
                )}
              </CardContent>
              <Box style={{ display: "flex", justifyContent: "flex-start" }}>
              {likeLength !== 0 && (
                <Box>
                  {likeLength === 1 ? (
                    <Box
                    className={classes.likeBox}
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                    </Box>
                  ) : (
                    <Box
                    className={classes.likeBox}
                    >
                      <FavoriteIcon style={{ fontSize: "16px" }} />
                      <Box
                        style={{
                          display: "contents",
                          fontSize: "10px",
                        }}
                      >
                        {likeLength}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              </Box>
            </Card>
            {appear === true && (
              <Box>
                {like === false ? (
                  <Box>
                    <FavoriteBorderIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                ) : (
                  <Box>
                    <FavoriteIcon
                      className={classes.like}
                      onClick={handleLikeClick}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </React.Fragment>

      // <React.Fragment>
      //   <Card
      //   onDoubleClick={handleLikeClick}
      //     style={{
      //       maxWidth: "50%",
      //       margin: { likeLength } === 0 ? "2px 20px" : "5px 20px",
      //       borderRadius: "20px",
      //     }}
      //   >
      //     <CardContent style={{ paddingBottom: "10px", padding: "10px" }}>
      //       {props.img !== undefined ? (
      //         <Box>
      //           {fullMode === false ? (
      //             <img
      //               onClick={() => {
      //                 setFullMode((prev) => !prev);
      //               }}
      //               style={{ width: "100%", height: "100%", cursor: "zoom-in" }}
      //               src={`data:image/${
      //                 props.img.contentType
      //               };base64,${Buffer.from(props.img.data).toString("base64")}`}
      //             />
      //           ) : (
      //             <img
      //               onClick={() => {
      //                 setFullMode((prev) => !prev);
      //               }}
      //               style={{
      //                 background:
      //                   "RGBA(0,0,0,.5) url(" +
      //                   `data:image/${
      //                     props.img.contentType
      //                   };base64,${Buffer.from(props.img.data).toString(
      //                     "base64"
      //                   )}` +
      //                   ") no-repeat center",
      //                 backgroundSize: "contain",
      //                 width: "100%",
      //                 height: "100%",
      //                 position: "fixed",
      //                 zIndex: "10000",
      //                 top: "0",
      //                 left: "0",
      //                 cursor: "zoom-out",
      //               }}
      //               src={`data:image/${
      //                 props.img.contentType
      //               };base64,${Buffer.from(props.img.data).toString("base64")}`}
      //             />
      //           )}
      //         </Box>
      //       ) : (
      //         <Typography style={{ margin: "0 10px", wordBreak: "break-word" }}>
      //           {props.text}
      //         </Typography>
      //       )}
      //     </CardContent>
      //     <Box>
      //       {like === false ? (
      //         <Box style={{ marginBottom: "10px" }}>
      //           <FavoriteBorderIcon
      //             className={classes.like}
      //             onClick={handleLikeClick}
      //           />
      //           {likeLength === 0 ? "" : likeLength}
      //         </Box>
      //       ) : (
      //         <Box style={{ marginBottom: "10px" }}>
      //           <FavoriteIcon
      //             className={classes.like}
      //             onClick={handleLikeClick}
      //           />
      //           {likeLength === 0 ? "" : likeLength}
      //         </Box>
      //       )}
      //     </Box>
      //   </Card>
      // </React.Fragment>
    );
  }
}
