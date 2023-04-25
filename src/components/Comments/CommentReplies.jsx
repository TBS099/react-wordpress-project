import React from "react";
import TimePassed from "../Time/Time";
import ReactHtmlParser from "html-react-parser";
import ReplyForm from "./ReplyForm";
import "./Comments.css";

//Creates CommentReplies Class
class CommentReplies extends React.Component {
  constructor(props) {
    super(props);

    //Declare state
    this.state = {
      comments: this.props.comments,
      commentID: this.props.commentID,
      users: this.props.users,
    };
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
    const { comments, users, commentID } = this.props;

    //Filters out post comments
    const Replies = comments.filter((comment) => comment.parent !== 0);

    //Filters out post comments for Replies Reply
    const ReplyReply = comments.filter((comment) => comment.parent !== 0);

    //Display HTML
    return Replies.reverse().map((reply) => {
      if (reply.parent === commentID) {
        return (
          <div className="comment reply">
            <div className="comment-header row">
              <img
                src={reply.author_avatar_urls[48]}
                className="avatar-img col-1"
              />
              {users.map((user) => {
                if (user.id === reply.author) {
                  return (
                    <div className="comment-author col-9">
                      {user.name}
                      <TimePassed TimePassed={reply.date} />
                    </div>
                  );
                }
              })}
              <div className="col-2">
                <a
                  className="reply-link"
                  onClick={() => this.formChange(reply.id)}
                >
                  Reply
                </a>
              </div>
            </div>
            <br />
            <div className="comment-body body">
              {ReactHtmlParser(reply.content.rendered)}
            </div>
            <ReplyForm key={`reply-form-${reply.id}`} id={reply.id} onValueChange={this.props.onValueChange} />
            {ReplyReply.reverse().map((replyReply) => {
              if (replyReply.parent === reply.id) {
                return (
                  <div className="comment reply">
                    <div className="comment-header row">
                      <img
                        src={replyReply.author_avatar_urls[48]}
                        className="avatar-img col-1"
                      />
                      {users.map((user) => {
                        if (user.id === replyReply.author) {
                          return (
                            <div className="comment-author col-9">
                              {user.name}
                              <TimePassed TimePassed={replyReply.date} />
                            </div>
                          );
                        }
                      })}
                    </div>
                    <br />
                    <div className="comment-body body">
                      {ReactHtmlParser(replyReply.content.rendered)}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      }
    });
  }
}
export default CommentReplies;
