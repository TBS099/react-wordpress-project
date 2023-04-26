import React from "react";
import "./SinglePost.css";
import NavBar from "../NavBar/Navbar";
import TimePassed from "../Time/Time";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import Loader from "/src/assets/loader.gif";
import Comments from "../Comments/Comments";

//Creates SinglePost Class Component
class SinglePost extends React.Component {
  constructor(props) {
    super(props);

    //Declares state
    this.state = {
      loading: false,
      post: {},
      error: "",
      users: [],
      featuredMediaID: "",
      featuredMediaURL: "",
    };
  }

  //Pulls Single Post ID from the url
  CurrentUrl = window.location.href.split("/");
  CurrentUrl = this.CurrentUrl[this.CurrentUrl.length - 1];

  //Calls functions upon mounting of component
  componentDidMount() {
    const wordPressSiteUrl = "http://react-wordpress.local/";

    //Requesting data from wordpress site
    this.setState({ loading: true }, () => {
      axios
        .get(`${wordPressSiteUrl}/wp-json/wp/v2/posts/${this.CurrentUrl}`)
        .then(
          (res) => {
            this.setState({
              loading: false,
              post: res.data,
              featuredMediaID: res.data.featured_media,
            });
          },
          (error) =>
            this.setState({ loading: false, error: error.response.data })
        );

      axios.get(`${wordPressSiteUrl}/wp-json/wp/v2/users`).then(
        (res) => {
          this.setState({ loading: false, users: res.data });
        },
        (error) =>
          this.setState({ loading: false, error: error.response.data.message })
      );

      setTimeout(() => {
        if (this.state.featuredMediaID !== 0) {
            axios
              .get(
                `${wordPressSiteUrl}/wp-json/wp/v2/media/${this.state.featuredMediaID}`
              )
              .then(
                (res) => {
                  this.setState({
                    loading: false,
                    featuredMediaURL: res.data.source_url,
                  });
                },
                (error) =>
                  this.setState({
                    loading: false,
                    error: error.response.data.message,
                  })
              );
        }
      }, 500);
    });
  }

  render() {
    const {
      post,
      loading,
      error,
      users,
      featuredMediaURL,
    } = this.state;

    const username = users
      .map((user) => {
        if (user.id === post.author) {
          return user.name;
        }
      })
      .filter((value) => value != undefined);

    //Display HTML
    return (
      <main>
        <NavBar />
        {error && <div className="alert alert-danger">{error}</div>}
        {Object.keys(post).length ? (
          <div className="mt-5 post-container">
            <div key={post.id} className="card border-dark mb-3 col-10">
              <div className="card-header">
                <h3 className="header-text">{post.title.rendered}</h3>
                <div className="row">
                  <div className="author col-12">{username[0]}</div>
                  <div className="col-3">
                    <TimePassed TimePassed={post.date} />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="card-text post-content">
                  {featuredMediaURL === "" ? (
                    ""
                  ) : (
                    <div className="image">
                      <img
                        alt="featured-image"
                        className="sizing"
                        src={featuredMediaURL}
                      />
                    </div>
                  )}
                  {ReactHtmlParser(post.content.rendered)}
                </div>
              </div>
            </div>
            <Comments />
          </div>
        ) : (
          ""
        )}
        {loading && <img className="loader" src={Loader} alt="loader" />}
      </main>
    );
  }
}
export default SinglePost;
