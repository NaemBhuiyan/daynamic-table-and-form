import React from "react";
import "./App.css";
import { Container } from "reactstrap";
import GetForm from "./GetForm";
import ListTable from "./ListTable";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import UpdateForm from "./UdateForm";
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
