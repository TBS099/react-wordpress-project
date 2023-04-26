import React from "react";
import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";
import { UnprivilegedEditor } from "react-quill";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.quillRef = React.createRef();
  }

  //Change Input on typing
  handleInputChange = (html) => {
    console.log(html)
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
      <div className="text-editor">
        <ReactQuill
          name="newComment"
          id="my-commenttext"
          className="form-control comment-text"
          onChange={this.handleInputChange}
          placeholder={this.props.placeholder}
          modules={modules}
          formats={formats}
          ref={this.quillRef}
          theme={"snow"} // pass false to use minimal theme
        />
      </div>
    );
  }
}
export default Editor;
