import { Switch, Route } from "react-router-dom";
import NewTree from "../NewTree";
import Timeline from "../Timeline";

const Routes = () => {
  return (
    <Switch>
      <Route path="/tree/:id">
        <NewTree />
      </Route>
      <Route path="/">
        <Timeline />
      </Route>
    </Switch>
  );
};

export default Routes;
