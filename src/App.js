import React, { useState, useEffect } from "react";
import "./main.css";
// firebase
import { db, auth } from "./firebase";
// components
// import Header from "./components/Header";
import Poster from "./components/Post";
import ImageUpload from "./components/ImageUpload";
// material-UI
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openLogIn, setLogInOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // siempre que se añada un nuevo post , corre este codigo..
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //  user has logged out...
        setUser(null);
      }
    });

    return () => {
      //user has logged out
      unsuscribe();
    };
  }, [user, username]);

  const singUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };
  const logIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setLogInOpen(false);
  };
  return (
    <div className="App">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram logo, send you to home page"
        />
        {/* <LogIn /> */}
        <Modal
          open={open | openLogIn}
          onClose={() => {
            setOpen(false);
            setLogInOpen(false);
          }}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__singUp">
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Instagram logo, send you to home page"
                />
              </center>
              {openLogIn ? null : (
                <Input
                  placeholder="UserName"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {openLogIn ? (
                <Button type="submit" onClick={logIn}>
                  Log In
                </Button>
              ) : (
                <Button type="submit" onClick={singUp}>
                  Sing Up
                </Button>
              )}
            </form>
          </div>
        </Modal>
        {user ? (
          <div className="app__logAndProfContainer">
            <Button onClick={() => auth.signOut()}>LogOut</Button>
            <Avatar
              className="post__avatar"
              alt={user.displayName}
              src="/static/images/avatr/1.jpg"
            />
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setLogInOpen(true)}>Log In</Button>
            <Button onClick={() => setOpen(true)}>Sing Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Poster
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
