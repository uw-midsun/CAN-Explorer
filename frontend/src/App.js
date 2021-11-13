import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload/FileUpload";
import SendMessage from "./components/SendMessage/SendMessage";
import CanSettings from "./components/CanSettings/CanSettings";
import Home from "./views/Home";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/transmit" component={SendMessage} />
            <Route path="/file_upload" exact component={FileUpload} />
            <Route path="/can_settings" exact component={CanSettings} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
