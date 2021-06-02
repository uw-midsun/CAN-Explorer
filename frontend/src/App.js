import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import FileUpload from "./components/FileUpload/FileUpload";
import Home from './components/Home'

function App() {
  return (
    <Router>
      <div className="App">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">CAN Explorer</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                    <Link to="/" class="nav-link"> Home </Link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="http://localhost:8086">Visualization</a>
                    </li>
                    <li class="nav-item">
                        <Link to="/file_upload" class="nav-link"> DBC Upload</Link>
                    </li>
                </ul>
            </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/file_upload" exact component={FileUpload} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
