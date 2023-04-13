import React from "react";
import "./Login.css";
import NavBar from "../NavBar/Navbar";
import axios from "axios";
import Loader from '/src/assets/loader.gif';
import { Navigate } from "react-router-dom";



class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      userNiceName: "",
      userEmail: "",
      loggedIn: false,
      loading: false,
      error: "",
    };
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    const SiteUrl = "http://react-wordpress.local/";

    const loginData = {
      username: this.state.username,
      password: this.state.password,
    };

    this.setState({ loading: true }, () => {
      axios.post(` ${SiteUrl}/wp-json/jwt-auth/v1/token`, loginData).then(
        (res) => {
          console.log(res.data);
          if (undefined == res.data.token) {
            this.setState({ error: data.message, loading: false });
            return;
          }

          localStorage.setItem( 'token', res.data.token );
          localStorage.setItem( 'userName', res.data.user_nicename );
          localStorage.setItem('name',res.data.user_display_name)

          this.setState({
            loading: false,
            token: res.data.token,
            userNiceName: res.data.user_nicename,
            userEmail: res.data.user_email,
            loggedIn: true,
          });
        },
        (error) => {
          this.setState({error:error.message, loading:false})
        }
      );
    });
  };

  handleOnChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, password, error, loading, loggedIn } = this.state;

    if (loggedIn || localStorage.getItem('token')) {
      return <Navigate to={`/dashboard/${localStorage.getItem('userName')}`} noThrow/>
    }
    else {
      return (
        <main>
          <NavBar />
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="body">
            <div className="card login border-dark mb-3 col-2">
              <div className="card-header">
                <h3 className="header-text">Log In</h3>
              </div>
              <div className="card-body">
                <form onSubmit={this.onFormSubmit}>
                  <label className="form-group">
                    <p>User Name:</p>
                    <br />
                    <input
                      className="form-control"
                      name="username"
                      type="text"
                      value={username}
                      onChange={this.handleOnChange}
                    ></input>
                  </label>
                  <br />
                  <label className="form-group">
                    <p>Password:</p>
                    <br />
                    <input
                      className="form-control"
                      name="password"
                      type="password"
                      value={password}
                      onChange={this.handleOnChange}
                    ></input>
                  </label>
                  <br />
                  <button type="submit" className="submit" value="submit">
                    Log In
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
}
export default Login;