import React from "react";
import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.quillRef = React.createRef();
  }

  //Pulls Single Post ID from the url
  CurrentUrl = window.location.href.split("/");
  CurrentUrl = this.CurrentUrl[this.CurrentUrl.length - 1];
  

  //Change Input on typing
  handleInputChange = (html) => {
    this.props.EditorInputChange(html);
  };

  render() {
    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ];

    return (
      <div className={this.CurrentUrl == "create" ? "text-editor post-text-editor" : "text-editor"}>
        <ReactQuill
          name="newComment"
          id="my-commenttext"
          className="form-control comment-text"
          onChange={this.handleInputChange}
          placeholder={this.props.placeholder}
          modules={modules}
          formats={formats}
          ref={this.quillRef} />
      </div>
    );
  }
}
export default Editor;
