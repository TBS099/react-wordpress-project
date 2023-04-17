import React from "react";
import "./Home.css";
import NavBar from "../NavBar/Navbar";
import TimePassed from "../Time/Time";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import Loader from "/src/assets/loader.gif";
import Pagination from "../Pagination/Pagination";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      posts: [],
      error: "",
      currentPage: 1,
      postsPerPage: 5,
      users:[]
    };
  }

  componentDidMount() {
    const wordPressSiteUrl = "http://react-wordpress.local/";

    this.setState({ loading: true }, () => {
      axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/posts?per_page=100`).then(
        (res) => {
          this.setState({ loading: false, posts: res.data });
        },
        (error) =>
          this.setState({ loading: false, error: error.response.data.message })
      );

      axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/users`).then(
        (res) => {
          this.setState({ loading: false, users: res.data });
        },
        (error) =>
          this.setState({ loading: false, error: error.response.data.message })
      );
    });
  }

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { posts, loading, error, currentPage, postsPerPage, users } = this.state;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    console.log(posts);
    return (
      <div>
        <NavBar />
        <div className="title">
          <h1>Latest Posts</h1>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {currentPosts.length ? (
          <div className="mt-5 post-container">
            {currentPosts.map((post) => (
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
                  <div className="row col-12">
                    <div className="row col-6">
                    {users.map((user) => {
                    if (user.id === post.author) {
                      return(
                        <div className="col-7 author">{user.name}</div>
                        );
                    }
                    return null;
                  })}
                  <TimePassed TimePassed={post.date} />
                  </div>
                  <div className="col-6 padding">
                    <Link to={`/post/${post.id}`} className="button">
                      Read More...
                    </Link>
                  </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        <Pagination
          totalPosts={posts.length}
          postsPerPage={postsPerPage}
          paginate={this.paginate}
        />

        {loading && <img className="loader" src={Loader} alt="loader" />}
      </div>
    );
  }
}

export default Home;
