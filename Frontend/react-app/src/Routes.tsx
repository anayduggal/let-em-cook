import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/homepage";
import { LoginForm } from "./components/LoginForm";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}
export default Routes;
