import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import SiderMenu from './components/Menu/Menu';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

class App extends React.Component {
  state = {
    isLoggedIn: false,
    User_ID: '',
    // isLoggedIn: true,
  }

  LoggedIn = (id) => {
    this.setState({isLoggedIn: true});
    this.setState({User_ID: id});
  }

  LoggedOut = () => {
    this.setState({isLoggedIn: false});
    this.setState({User_ID: ''});
  }

  render() {
    return (
      <Router basename='/'>
        <Routes>
          <Route path='login' element={
            <Login 
              isLoggedIn={this.state.isLoggedIn}
              LoggedIn={this.LoggedIn}
            />}
          />
          <Route path='register' element={<Register/>}/>
          <Route path='' element={<SiderMenu isLoggedIn={this.state.isLoggedIn} User_ID={this.state.User_ID}/>}/>
        </Routes>
      </Router>
    )
  }
}

export default App;
