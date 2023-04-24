import React from "react";
import "./CreatePost.css";
import NavBar from "../NavBar/Navbar";
import Loader from "/src/assets/loader.gif";
import axios from "axios";

//Creating CreatePost Class Component
class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    //Declaring States
    this.state = {
      title: "",
      content: "",
      userID: "",
      message: "",
      postCreated: false,
      loading: false,
      featuredImage: [],
    };
  }

  //Takes Data and places it into __html
  createMarkup = (data) => ({
    __html: data,
  });

  //Action to be taken on form submit
  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    //Adding Image Data into ImgData
    const ImgData = new FormData();
    ImgData.append("file", this.state.featuredImage);
    ImgData.append("caption", "Image Caption");

    //Adding Post Data into formData
    const formData = new FormData();
    formData.append("title", this.state.title);
    formData.append("content", this.state.content);
    formData.append("status", "publish");

    const wordPressSiteUrl = "http://react-wordpress.local/";
    const authToken = localStorage.getItem("token");

    //Image Upload Request
    axios
      .post(`${wordPressSiteUrl}/wp-json/wp/v2/media`, ImgData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const imageId = response.data.id;
        formData.append("featured_media", imageId);
      });

    // Post Upload Request
    setTimeout(() => {
      axios
        .post(`${wordPressSiteUrl}/wp-json/wp/v2/posts`, formData, {
          headers: {
            "Content-type": "form/multipart",
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(
          (res) => {
            this.setState({
              loading: false,
              postCreated: !!res.data.id,
              message: res.data.id ? "New Post Created" : "",
            });
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
          (error) =>
            this.setState({
              loading: false,
              message: error.response.data.message,
            })
        );
    }, 1500);
  };

  //Function that takes data apon entering and places it into states
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  //Function that takes file data and inserts it into states
  handleImageInput = (event) => {
    this.setState({ featuredImage: event.target.files[0] });
  };

  render() {
    const { loading, message, postCreated } = this.state;

    //Display HTML
    return (
      <main>
        <NavBar />
        <h1 className="title">Create Post</h1>
        <div className="center-align">
          <div className="card box">
            <div className="card-body">
              <form
                onSubmit={this.handleFormSubmit}
                className="create-post-form"
              >
                {message && (
                  <div
                    className={`alert ${
                      postCreated ? "alert-success" : "alert-danger"
                    }`}
                    dangerouslySetInnerHTML={this.createMarkup(message)}
                  />
                )}
                <div className="form-group">
                  <label htmlFor="title" className="form-title">
                    Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    onChange={this.handleInputChange}
                    className="form-control"
                    id="title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="my-postcontent" className="form-title">
                    Content:
                  </label>
                  <textarea
                    name="content"
                    id="my-postcontent"
                    rows="10"
                    className="form-control"
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-title" htmlFor="featuredImages">
                    Featured Image:
                  </label>
                  <input
                    type="file"
                    name="featuredImage"
                    id="featuredImage"
                    className="form-control"
                    onChange={this.handleImageInput}
                  />
                </div>
                <button type="submit" className="submit form" value="submit">
                  <h5>Submit</h5>
                </button>
              </form>
            </div>
          </div>
        </div>
        {loading && <img className="loader" src={Loader} alt="loader" />}
      </main>
    );
  }
}
export default CreatePost;
