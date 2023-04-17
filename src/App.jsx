import React from "react";
import Home from "./components/Home/Home";
import SinglePost from "./components/SinglePost/SinglePost";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import CreatePost from "./components/CreatePosts/CreatePost";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route exact path="/post/:id" element={<SinglePost />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/dashboard/:username" element={<Dashboard />}></Route>
            <Route path="/create" element={<CreatePost />}></Route>
          </Routes>
        </Router>
      </main>
    );
  }
}
export default App;
