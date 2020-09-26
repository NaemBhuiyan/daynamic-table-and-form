import React from "react";
import { Container } from "reactstrap";
import GetForm from "./components/GetForm";
import ListTable from "./components/ListTable";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import UpdateForm from "./components/UdateForm";
function App() {
  return (
    <div className="App">
      <section>
        <Container>
          <Router>
            <NavbarComponent />
            <Switch>
              <Route exact path="/">
                <ListTable />
              </Route>
              <Route exact path="/get-form">
                <GetForm />
              </Route>
              <Route exact path="/update-form/:userId" component={UpdateForm} />
            </Switch>
          </Router>
        </Container>
      </section>
    </div>
  );
}

export default App;
