import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CanRawPage from "./components/CanRawPage";
import CanDecodedPage from "./components/CanDecodedPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/api/can_server/raw" exact component={CanRawPage} />
          <Route path="/api/can_server/decoded" component={CanDecodedPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
