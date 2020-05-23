import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  getFromStorage,
  setInStorage,
} from "../../Utils/storage"

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: ""
    };


    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logOut = this.logOut(this);
  }

  componentDidMount()
  {
    const obj = getFromStorage("the_main_app");
    if( obj && obj.token )
    {
      const { token } = obj;
      //weryfikacja tokenu
      //startowy content template
      fetch('/api/account/verify?token=' + token).then(res => res.json()).then(json => {
        if(json.success)
        {
          this.setState({
            token,
            isLoading: false
          });
        }
        else
        {
          this.state({
            isLoading: false,
          });
        }
      });
    }
    else
    {
      this.state({
        isLoading: false,
      });
    }
  }

  onTextBoxChangeSignInEmail(event)
  {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextBoxChangeSignInPassword(event)
  {
    this.setState({
      signInPasword: event.target.value,
    });
  }

  onTextBoxChangeSignUpEmail(event)
  {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextBoxChangeSignUpPassword(event)
  {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextBoxChangeSignUpFirstName(event)
  {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }

  onTextBoxChangeSignUpLastName(event)
  {
    this.setState({
      signUpLastName: event.target.value,
    });
  }

onSignIn()
{
    //Grab state
    const {
      signInEmail,
      signInPassword
    } = this.state;

    this.setState({
      isLoading: true,
    });

    //post request to backend
    fetch('/api/account/signin', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      }),
    })
      .then(res => res.json())
        .then(json => {
          if(json.success)
          {
            setInStorage("the_main_app", { token });
            this.state({
              signInError: json.message,
              isLoading: false,
              signInPassword: "",
              signInEmail: "",
              token: json.token
            });
          }
          else
          {
            this.state({
              signInError: json.message,
              isLoading: false,
            });
          }
        });
}

onSignUp()
{
  //Grab state
  const {
    signUpFirstName,
    signUpLastName,
    signUpEmail,
    signUpPassword
  } = this.state;

  this.setState({
    isLoading: true,
  });

  //post request to backend
  fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      firstName: signUpFirstName,
      lastName: signUpLastName,
      email: signUpEmail,
      password: signUpPassword
    }),
  })
    .then(res => res.json())
      .then(json => {
        if(json.success)
        {
          this.state({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpPassword: "",
            signUpFirstName: "",
            signUpLastName: ""
          });
        }
        else
        {
          this.state({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
}

  logOut()
  {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage("the_main_app");
    if( obj && obj.token )
    {
      const { token } = obj;
      //weryfikacja tokenu
      //startowy content template
      fetch('/api/account/logout?token=' + token).then(res => res.json()).then(json => {
        if(json.success)
        {
          this.setState({
            token: "",
            isLoading: false
          });
        }
        else
        {
          this.state({
            isLoading: false,
          });
        }
      });
    }
    else
    {
      this.state({
        isLoading: false,
      });
    }
  }

  render()
  {
      const {
        isLoading,
        token,
        signInError,
        signInEmail,
        signInPassword,
        signUpFirstName,
        signUpLastName,
        signUpEmail,
        signUpPassword,
      } = this.state;

      if(isLoading)
      {
        return (<div><p>Loading...</p></div>);
      }

      if(!token)
      {
        return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }

            <p>Zaloguj się</p>

              <input

              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextBoxChangeSignInEmail}
              />

              <br/>

              <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextBoxChangeSignInPassword}
              />

              <br/>

              <button onClick={this.onSignIn}>Zaloguj się</button>

          </div>
          <br/>
          <br/>
          <div>
          {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }

            <p>Zarejestruj się</p>

            <input
            type="text"
            placeholder="First Name"
            value={signUpFirstName}
            onChange={this.onTextBoxChangeSignUpFirstName}
            />

            <br/>

            <input
            type="text"
            placeholder="Last Name"
            value={signUpLastName}
            onChange={this.onTextBoxChangeSignUpLastName}
            />

            <br/>

            <input
            type="email"
            placeholder="Email"
            value={signUpEmail}
            onChange={this.onTextBoxChangeSignUpEmail}
            />

            <br/>

            <input
            type="password"
            placeholder="Password"
            value={signUpPassword}
            onChange={this.onTextBoxChangeSignUpPassword}
            />

            <br/>

            <button onClick={this.onSignUp}>Zarejestruj się</button>

          </div>
        </div>
        )
      }

      return (
      <div
      ><p>Account</p>
      <button onClick={this.logOut}>Wyloguj</button>
      </div>
      )
  }
}

export default Home;
