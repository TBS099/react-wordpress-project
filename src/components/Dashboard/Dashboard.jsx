import React from "react";
import NavBar from "../NavBar/Navbar";
import "./Dashboard.css";
import axios from "axios";
import TimePassed from "../Time/Time";
import { Link } from "react-router-dom";
import ReactHtmlParser from "html-react-parser";
import { Navigate } from "react-router-dom";
import Loader from "/src/assets/loader.gif";
import Pagination from "../Pagination/Pagination";

//Creates Dashboard Class Component
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    //Declaring states
    this.state = {
      loading: false,
      posts: [],
      users: [],
      error: "",
      currentPage: 1,
      postsPerPage: 5,
    };
  }

  //Calls functions upon mounting of component
  componentDidMount() {
    const wordPressSiteUrl = "http://react-wordpress.local/";

    //Requesting data from wordpress site
    this.setState({ loading: true }, () => {
      axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/users`).then(
        (res) => {
          this.setState({ loading: false, users: res.data });
        },
        (error) =>
          this.setState({ loading: false, error: error.response.data.message })
      );

      axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/posts?per_page=100`).then(
        (res) => {
          this.setState({ loading: false, posts: res.data });
        },
        (error) =>
          this.setState({ loading: false, error: error.response.data.message })
      );
    });
  }

  //Takes prop from parent component and sets currentPage to the value passed down
  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  //Log Out Function
  LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");

    return <Navigate to={`/login`} noThrow />;
  };

  render() {
    const { posts, users, loading, error, currentPage, postsPerPage } =
      this.state;

    //Singles out user that is logged in
    const UserID = users
      .map((user) => {
        if (user.name === localStorage.getItem("name")) {
          return user.id;
        } else {
          return "";
        }
      })
      .filter((value) => value !== "");

    //Gathers posts of user that is logged in
    const Posts = posts.filter((value) => value.author === UserID[0]);

    //Finds index of last post on page
    const indexOfLastPost = currentPage * postsPerPage;

    //Finds index of first post on a page
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    //Divides posts into pages on the basis of first and last post
    const currentPosts = Posts.slice(indexOfFirstPost, indexOfLastPost);

    //Display HTML
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

            {currentPosts.length
              ? currentPosts.map((post) => (
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
                ))
              : ""}

            <Pagination
              totalPosts={Posts.length}
              postsPerPage={postsPerPage}
              paginate={this.paginate}
            />
          </div>
        </div>
        {loading && <img className="loader" src={Loader} alt="loader" />}
      </div>
    );
  }
}
export default Dashboard;
