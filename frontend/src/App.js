import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { 
      data: {}
    };
  }

  async componentDidMount() {
    await fetch('http://localhost:4000/api', {
      }, {
        mode: 'cors',
        method: 'get',
        url: `http://localhost:4000`,
        credentials: 'include'
      })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.setState({
          data: data
        })
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
