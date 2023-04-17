import React from "react";
import "./CreatePost.css";
import NavBar from "../NavBar/Navbar";
import Loader from "/src/assets/loader.gif";
import axios from "axios";

class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
      userID: "",
      message: "",
      postCreated: false,
      loading: false,
    };
  }

  createMarkup = (data) => ({
    __html:data
  })

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({loading:true});

    const formData = {
      title: this.state.title,
      content: this.state.content,
      status: 'publish'
    }

    const wordPressSiteUrl = "http://react-wordpress.local/";
    const authToken = localStorage.getItem('token'); 

    // Post Request
    axios.post(`${wordPressSiteUrl}/wp-json/wp/v2/posts`, formData, {headers:{
      'Content-type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }})
    .then(
      (res) => {console.warn('res',res);
        this.setState({ loading: false, postCreated: !! res.data.id, message: res.data.id?'New Post Created':'' });
      },
      (error) =>
        this.setState({ loading: false, message: error.response.data.message })
    )
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { loading, message, title, content, userID, postCreated } = this.state;

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
