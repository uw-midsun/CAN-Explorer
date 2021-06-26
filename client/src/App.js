import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload/FileUpload";
import SendMessage from "./components/SendMessage/SendMessage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={FileUpload} />
          <Route path="/transmit" component={SendMessage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
