import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HubConnectionBuilder} from '@microsoft/signalr';

let connection = new HubConnectionBuilder().withUrl("https://localhost:5001/chatHub").build();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSessionInitialized: false,
      user: "",
      message: "",
      otherUser: {
        name: "",
        message: ""
      }
    };
  }

  componentDidMount() {
    connection.on("ReceiveMessage", this.onMessageReceived);
    connection.on("ReceiveYell", this.onYellReceive);
    connection.start().then(this.onConnectionStarted)
  }

  onConnectionStarted = () => {
    this.setState({
      isSessionInitialized: true
    })
  }

  onMessageReceived = (user, message) => {
    this.setState({
      otherUser: {
        name: user,
        message
      }
    });
  }

  onYellReceive = (yelledMessage) => {
    this.setState({
      yelledMessage
    });
  }

  sendMessage = (user, message) => {
    connection.invoke("SendMessage", user, message).catch(function (err) {
      return console.error(err.toString());
    });
    connection.invoke("YellIfMessageHasNeat", message).catch(function (err) {
      return console.error(err.toString());
    });
  }

  onMessageChange = (e) => {
    const message = e.target.value;
    this.sendMessage(this.state.user, message)
  }

  render() {
    const {
      otherUser,
      message,
      user,
      yelledMessage
    } = this.state;
    return (
      <div className="App">
        <input value={user} onChange={(e) => this.setState({user: e.target.value})} />
        <input onChange={this.onMessageChange} />
        <button type="button" onClick={this.sendMessage}>Send</button>
        <div>{otherUser.name} says {otherUser.message}</div><br />
        <div>{yelledMessage}</div>
      </div>
    );
  }
  
}

export default App;
