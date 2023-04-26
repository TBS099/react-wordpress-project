import React from "react";
import axios from "axios";
import Loader from "/src/assets/loader.gif";
import "./Comments.css";
import ReactQuill from "react-quill";

//Creates ReplyForm Class Component
class ReplyForm extends React.Component {
  constructor(props) {
    super(props);

    //Declaring state
    this.state = {
      loading: false,
      message: "",
      newComment: "",
      parentID: this.props.id,
      commentCreated: false,
    };
  }

  ReverseFormChange() {
    const replyForm = document.querySelectorAll(".reply-form");
    replyForm.forEach((form) => {
      form.style.display = "none";
    });
    const commentForm = document.querySelector(".comment-form");
    commentForm.style.display = "flex";
  }

  //Pulls Single Post ID from the url
  CurrentUrl = window.location.href.split("/");
  CurrentUrl = this.CurrentUrl[this.CurrentUrl.length - 1];

  //Takes Data and places it into __html
  createMarkup = (data) => ({
    __html: data,
  });

  //Function that takes data apon entering and places it into states
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  //Function to handle form submission
  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    //Adding Data into formData
    const formData = new FormData();
    formData.append("content", this.state.newComment);
    formData.append("post", this.CurrentUrl);
    formData.append("status", "publish");
    formData.append("parent", this.state.parentID);

    const wordPressSiteUrl = "http://react-wordpress.local/";
    const authToken = localStorage.getItem("token");

    // Post Request
    axios
      .post(`${wordPressSiteUrl}/wp-json/wp/v2/comments`, formData, {
        headers: {
          "Content-type": "form/multipart",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(
        (res) => {
          this.props.onCommentAddition(res.data);
          const ClearReplyForm = document.querySelectorAll("#my-replycomment");
          ClearReplyForm.forEach((form) => {
            form.value = "";
          });
          this.setState({
            loading: false,
            commentCreated: !!res.data.id,
            message: res.data.id ? "Comment Added" : "",
          });
        },
        (error) =>
          this.setState({
            loading: false,
            message: error.response.data.message,
          })
      );
  };

  render() {
    const { loading, message, commentCreated, parentID } = this.state;

    //Display HTML
    return (
      <div className="card-form reply-form" id={`number${parentID}`}>
        <form onSubmit={this.handleFormSubmit} className="create-post-form">
          {message && (
            <div
              className={`alert ${
                commentCreated ? "alert-success" : "alert-danger"
              }`}
              dangerouslySetInnerHTML={this.createMarkup(message)}
            />
          )}
          <div className="form-group">
            <h3 className="card-form-title">Reply to a Comment:</h3>
            <a
              className="cancel-reply-link"
              onClick={() => this.ReverseFormChange()}
            >
              Cancel Reply
            </a>
            <label
              htmlFor="my-postcontent"
              className="form-title card-form-subtitle"
            >
              Comment:
            </label>
            <textarea
              name="newComment"
              id="my-replycomment"
              rows="10"
              className="form-control comment-text"
              onChange={this.handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="submit form submit-btn"
            value="submit"
          >
            <h5>Submit</h5>
          </button>
        </form>
        {loading && <img className="loader" src={Loader} alt="loader" />}
      </div>
    );
  }
}
export default ReplyForm;
