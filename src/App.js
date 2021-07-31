import React, { useState, useEffect } from "react";
import "./main.css";
import { db } from "./firebase";
import Header from "./components/Header";
import Poster from "./components/Post";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      // siempre que se añada un nuevo post , corre este codigo..
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <Header />

      {posts.map(({ id, post }) => (
        <Poster
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
