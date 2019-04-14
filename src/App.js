import React, { Component } from 'react';
import {BrowserRouter as Router, NavLink} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import logo from './logo.svg';
import './App.css';
import AreaChart from './AreaChart';


class App extends Component {

  

  render() {
   
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <div>Line chart application</div>
        </header>
        <ul class="sidebar">
          <li>
            <NavLink to="/" exact activeStyle={{color: 'green'}}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/linechart"  exact activeStyle={{color: 'green'}}>Line Chart</NavLink>
          </li>
        </ul>
        <Route path="/" exact render={() =>{
          return (<h1>Welcome to Line Chart Application</h1>)
        }
          
        } />
        <AreaChart />
      </div>
      </Router>
    );
  }
}

export default App;
