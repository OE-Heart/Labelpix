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
  }

  LoggedIn = () => {
    this.setState({isLoggedIn: true});
  }

  LoggedOut = () => {
    this.setState({isLoggedIn: false});
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path='/login' element={
            <Login 
              isLoggedIn={this.state.isLoggedIn}
              LoggedIn={this.LoggedIn}
            />}
          />
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<SiderMenu isLoggedIn={this.state.isLoggedIn}/>}/>
        </Routes>
      </Router>
    )
  }
}

export default App;
