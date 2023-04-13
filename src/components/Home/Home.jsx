import React from "react";
import "./Home.css";
import NavBar from "../NavBar/Navbar";
import TimePassed from "../Time";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import Loader from "/src/assets/loader.gif";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      posts: [],
      error: "",
    };
  }

  componentDidMount() {
    const wordPressSiteUrl = "http://react-wordpress.local/";
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

  render() {
    const { posts, loading, error } = this.state;
    return (
      <div>
        <NavBar />
        <div className="title"><h1>Latest Posts</h1></div>
        {error && <div className="alert alert-danger">{error}</div>}
        {posts.length ? (
          <div className="mt-5 post-container">
            {posts.map((post) => (
              <div key={post.id} className="card border-dark mb-3">
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
        ) : (
          ""
        )}
        {loading && <img className="loader" src={Loader} alt="loader" />}
      </div>
    );
  }
}
export default Home;