import React from "react";
import TimePassed from "../Time/Time";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import Loader from "/src/assets/loader.gif";
import "./Comments.css";
import CommentForm from "./CommentForm";

//Creates Comments Class Component
class Comments extends React.Component {
  constructor() {
    super();

    //Declaring state
    this.state = {
      loading: false,
      users: [],
      comments: [],
      error: "",
      commentReply: [],
    };
  }

  //Pulls Single Post ID from the url
  CurrentUrl = window.location.href.split("/");
  CurrentUrl = this.CurrentUrl[this.CurrentUrl.length - 1];

  // Calls functions upon mounting of component
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

      axios
        .get(
          `${wordPressSiteUrl}/wp-json/wp/v2/comments?post=${this.CurrentUrl}`
        )
        .then(
          (res) => {
            this.setState({
              loading: false,
              comments: res.data,
            });
          },
          (error) =>
            this.setState({ loading: false, error: error.response.data })
        );
    });
  }

  render() {
    const { comments, loading, error, users, commentReply } = this.state;

    //Filters out comment replies
    const Comments = comments.filter((comment) => comment.parent === 0);

    //Display HTML
    return (
      <div className="">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card border-dark mb-3 col-10 comment-card">
          {Comments.length
            ? Comments.map((comment) => {
                return (
                  <div className="comment" key={comment.id}>
                    <div className="comment-header row">
                      <img
                        src={comment.author_avatar_urls[48]}
                        className="avatar-img col-1"
                      />
                      {users.map((user) => {
                        if (user.id === comment.author) {
                          return (
                            <div className="comment-author col-5">
                              {user.name}
                            </div>
                          );
                        }
                      })}
                    </div>
                    <br />
                    <div className="comment-body body">
                      {ReactHtmlParser(comment.content.rendered)}
                    </div>
                  </div>
                );
              })
            : ""}
          <CommentForm />
        </div>

        {loading && <img className="loader" src={Loader} alt="loader" />}
      </div>
    );
  }
}
export default Comments;
