import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CanMessagePage from "./components/CanMessagePage"

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={CanMessagePage} />
          <Route path="/api/can_server" component={CanMessagePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
