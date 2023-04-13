import React from "react";
import NavBar from "./NavBar/Navbar";
import TimePassed from "./Time";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import Loader from "/src/assets/loader.gif";

class SinglePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      post: {},
      error: "",
    };
  }

  CurrentUrl = window.location.href.split("/");
  CurrentUrl = this.CurrentUrl[this.CurrentUrl.length - 1];

  componentDidMount() {
    const wordPressSiteUrl = "http://react-wordpress.local/";
    this.setState({ loading: true }, () => {
      axios
        .get(`${wordPressSiteUrl}/wp-json/wp/v2/posts/${this.CurrentUrl}`)
        .then(
          (res) => {
            this.setState({ loading: false, post: res.data });
            console.log(this.state.post);
          },
          (error) =>
            this.setState({ loading: false, error: error.response.data })
        );
    });
  }

  render() {
    const { post, loading, error } = this.state;

    console.log(post);
    return (
      <main>
        <NavBar />
        {error && <div className="alert alert-danger">{error}</div>}
        {Object.keys(post).length ? (
          <div className="mt-5 post-container">
            <div key={post.id} className="card border-dark mb-3 col-10">
              <div className="card-header">
                <h3 className="header-text">{post.title.rendered}</h3>
                <TimePassed TimePassed={post.date} />
              </div>
              <div className="card-body">
                
                <div className="card-text post-content">
                  {ReactHtmlParser(post.content.rendered)}
                </div>
              </div>
            </div>
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