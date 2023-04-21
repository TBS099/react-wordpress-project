import React from "react";
import TimePassed from "../Time/Time";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import Loader from "/src/assets/loader.gif";
import "./Comments.css";
import CommentReplies from "./CommentReplies";
import CommentForm from "./CommentForm";
import ReplyForm from "./ReplyForm";

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

    // Bind the this context to the formChange function
    this.formChange = this.formChange.bind(this);
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
          `${wordPressSiteUrl}/wp-json/wp/v2/comments?post=${this.CurrentUrl}&&per_page=20`
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

  //Displays reply form while hiding comment form
  formChange(id) {
    const replyForm = document.querySelectorAll(".reply-form");
    replyForm.forEach((form) => {
      form.style.display = "none";
    });
    const commentForm = document.querySelector(".comment-form");
    commentForm.style.display = "none";
    const replyForms = document.getElementById(`number${id}`);
    replyForms.style.display = "block";
  }

  render() {
    const { comments, loading, error, users, commentReply } = this.state;

    //Filters out comment replies
    const Comments = comments.filter((comment) => comment.parent === 0);

    //Display HTML
    return (
      <div className="card border-dark mb-3 col-10 comment-card">
        {error && <div className="alert alert-danger">{error}</div>}
        <h3>Comments:</h3>
        {Comments.length
          ? Comments.map((comment) => {
              return (
                <div className="comment">
                  <div className="comment-header row">
                    <img
                      src={comment.author_avatar_urls[48]}
                      className="avatar-img col-1"
                    />
                    {users.map((user) => {
                      if (user.id === comment.author) {
                        return (
                          <div className="comment-author col-9">
                            {user.name}
                          </div>
                        );
                      }
                    })}
                    <div className="col-2">
                      <a
                        className="reply-link"
                        onClick={() => this.formChange(comment.id)}
                      >
                        Reply
                      </a>
                    </div>
                  </div>
                  <br />
                  <div className="comment-body body">
                    {ReactHtmlParser(comment.content.rendered)}
                  </div>
                  <ReplyForm id={comment.id} />
                  <CommentReplies
                    comments={comments}
                    commentID={comment.id}
                    users={users}
                  />
                </div>
              );
            })
          : ""}
        <CommentForm />
        {loading && <img className="loader" src={Loader} alt="loader" />}
        <script>
          {React.createElement("script", {
            dangerouslySetInnerHTML: {
              __html:
                "document.querySelector('.reply-form').style.display = 'none';",
            },
          })}
        </script>
      </div>
    );
  }
}
export default Comments;
