import React from "react";
import { Link } from "react-router-dom";


class NavBar extends React.Component {
  render() {
    if (localStorage.getItem('token')) {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <div
              className="navbar-collapse collapse show"
              id="navbarColor02"
            >
              <ul className="navbar-nav me-auto">
                <li className="nav-item" >
                  <Link className="nav-link" to ='/'>
                    Home
                    <span className="visually-hidden">(current)</span>
                  </Link>
                </li>
                <li className="nav-item" >
                  <Link className="nav-link" to ={`/dashboard/${localStorage.getItem('userName')}`}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item" >
                  <Link className="nav-link" to ={`/create`}>
                    Create Post
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <div
            className="navbar-collapse collapse show"
            id="navbarColor02"
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item" >
                <Link className="nav-link active" to ='/'>
                  Home
                  <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item" >
                <Link className="nav-link" to ='/login'>
                  Log In

                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
export default NavBar;