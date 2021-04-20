import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from './assets/images/logo.svg';
import Search from './components/Search/Search';
import MovieDetails from './components/MovieDetails/MovieDetails';
import NotFound from './components/NotFound/NotFound';
import './App.scss';

function App() {
  return (
    <div className="container">
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/"><img src={logo} className="App-logo" alt="logo" /></Link>
          </header>
          <Switch>
            <Route path="/movie/:id" exact component={MovieDetails}>
              <MovieDetails />
            </Route>
            <Route exact path="/" exact component={Search}>
              <Search />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
        </Router>
      </div>
  );
}

export default App;
