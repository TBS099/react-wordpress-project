import React from "react";
import axios from "axios";
import Loader from "/src/assets/loader.gif";
import "./Comments.css";
import Editor from "../Editor/Editor";

//Creates CommentForm Class Component
class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    //Declaring state
    this.state = {
      loading: false,
      message: "",
      newComment: "",
      commentCreated: false,
    };
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

  //Editor Input Change
  EditorInputChange = (input) => {
    this.setState({ newComment: input });
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
          this.setState({
            loading: false,
            commentCreated: !!res.data.id,
            message: res.data.id ? "Comment Added" : "",
          });
          this.props.onCommentAddition(res.data);
          const ClearReplyForm = document.querySelectorAll(".ql-editor");
          ClearReplyForm.forEach((quillInstance) => {
            quillInstance.innerHTML = "";
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
    const { loading, message, commentCreated } = this.state;

    //Display HTML
    return (
      <div className="card card-form comment-form">
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
            <h3 className="card-form-title">Write a Comment:</h3>
            <label
              htmlFor="my-postcontent"
              className="form-title card-form-subtitle"
            >
              Comment:
            </label>
            <Editor EditorInputChange={this.EditorInputChange} />
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
export default CommentForm;
