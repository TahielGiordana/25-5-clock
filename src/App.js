import "./App.css";
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Default time in seconds
      sessionLength: 25 * 60,
      breakLength: 5 * 60,
      timeLeft: 25 * 60,
      isPaused: true,
      intervalID: null,
    };
    this.formatTime = this.formatTime.bind(this);
    this.handleBreak = this.handleBreak.bind(this);
    this.handleSession = this.handleSession.bind(this);
    this.reset = this.reset.bind(this);
    this.controlSession = this.controlSession.bind(this);
  }

  formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    //Add a 0 first if minutes or seconds < 10
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  reset() {
    clearInterval(this.state.intervalID);
    this.setState({
      sessionLength: 25 * 60,
      breakLength: 5 * 60,
      timeLeft: 25 * 60,
      isPaused: true,
      intervalID: null,
    });
  }

  handleSession(seconds) {
    if (this.state.sessionLength + seconds > 0) {
      this.setState({
        sessionLength: this.state.sessionLength + seconds,
        timeLeft: this.state.sessionLength + seconds,
      });
    }
  }

  handleBreak(seconds) {
    if (this.state.breakLength + seconds > 0) {
      this.setState({
        breakLength: this.state.breakLength + seconds,
      });
    }
  }

  controlSession() {
    if (!this.state.isPaused) {
      clearInterval(this.state.intervalID);
      this.setState({
        intervalID: null,
        isPaused: true,
      });
    } else {
      let interval = setInterval(() => {
        if (this.state.timeLeft > 0) {
          this.setState({
            timeLeft: this.state.timeLeft - 1,
            intervalID: interval,
            isPaused: false,
          });
        } else {
          this.setState({
            timeLeft: this.state.breakLength,
            isPaused: true,
          });
          let audio = new Audio(
            "http://sartechnology.ca/sartechnology/sarsound.mp3"
          );
          audio.play();
        }
      }, 1000);
    }
  }

  render() {
    return (
      <div className="app">
        <h1>25 + 5 Clock</h1>
        <Session
          type="break"
          time={this.formatTime(this.state.breakLength)}
          handleClick={this.handleBreak}
        />
        <Session
          type="session"
          time={this.formatTime(this.state.sessionLength)}
          handleClick={this.handleSession}
        />
        <div className="timer-wrapper">
          <h2 id="timer-label">Session</h2>
          <p>{this.formatTime(this.state.timeLeft)}</p>
          <button id="start_stop" onClick={this.controlSession}>
            ||
          </button>
          <button id="reset" onClick={this.reset}>
            O
          </button>
        </div>
      </div>
    );
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="session-wrapper">
        <h2 id={this.props.type + "-label"}>{this.props.type + " Length"}</h2>
        <p id={this.props.type + "-length"}>{this.props.time}</p>
        <button
          id={this.props.type + "-decrement"}
          onClick={() => this.props.handleClick(-60)} //Decrement a minute
        >
          <i className="bi bi-arrow-down-square-fill"></i>
        </button>
        <button
          id={this.props.type + "-increment"}
          onClick={() => this.props.handleClick(60)} //Increment a minute
        >
          <i className="bi bi-arrow-up-square-fill"></i>
        </button>
      </div>
    );
  }
}

export default App;
