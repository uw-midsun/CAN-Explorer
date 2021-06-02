import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload/FileUpload";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={FileUpload} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
