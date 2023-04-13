import React from "react";
import NavBar from "../NavBar/Navbar";
import "./Dashboard.css";
import axios from "axios";
import TimePassed from "../Time";
import { Link } from "react-router-dom";
import ReactHtmlParser from "html-react-parser";
import { Navigate } from "react-router-dom";
import Loader from '/src/assets/loader.gif';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      posts: [],
      users: [],
      error: "",
    };
  }

  componentDidMount() {
    const wordPressSiteUrl = "http://react-wordpress.local/";

    axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/users`).then(
      (res) => {
        this.setState({ loading: false, users: res.data});
      },
      (error) =>
        this.setState({ loading: false, error: error.response.data.message })
    );


    this.setState({ loading: true }, () => {
      axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/posts`).then(
        (res) => {
          this.setState({ loading: false, posts: res.data });
        },
        (error) =>
          this.setState({ loading: false, error: error.response.data.message })
      );
    });
  }

  LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");

    return <Navigate to={`/login`} noThrow />;
  };

  render() {
    const { posts, users, loading, error } = this.state;
    
    const UserID = users.map(user => {
      if(user.name === localStorage.getItem('name')) {
        return user.id;
      }
      else{ return ""}
    })
    .filter(value => value !== "");

    const Posts = posts.filter(value => value.author === UserID[0]);
    return (
      <div>
        <NavBar />
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="center-align">
          <h1 className="title">Dashboard</h1>
          <br />
          Welcome {localStorage.getItem("userName")}! Not{" "}
          {localStorage.getItem("userName")}?
          <a href="/login" onClick={this.LogOut}>
            Log Out.
          </a>
          <div className="card box">
            <h3 className="dashboard-title">Your Posts</h3>

            {Posts.map((post) => (
              <div key={post.id} className="card userpost border-dark mb-3">
                <div className="card-header">
                  <h3 className="header-text">{post.title.rendered}</h3>
                </div>
                <div className="card-body">
                  <div className="card-text post-content">
                    {ReactHtmlParser(post.excerpt.rendered)}
                  </div>
                </div>
                <div className="card-footer">
                  <TimePassed TimePassed={post.date} />
                  <div className="col-6">
                    <Link to={`/post/${post.id}`} className="button">
                      Read More...
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {loading && <img className="loader" src={Loader} alt="loader" />}
      </div>
    );
  }
}
export default Dashboard;
