import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Input } from "@material-ui/core";
import { db } from "../firebase";
import firebase from "firebase";

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    let unsuscribe;
    if (postId) {
      unsuscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsuscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      {/* header --> avatar + username*/}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatr/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      {/*image*/}
      <img src={imageUrl} alt="" className="post__image" />
      {/* username + caption*/}
      <h4 className="post__text">
        <strong>{username}:</strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}: </strong>
            {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <Input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
