import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

const Router = () => (
  <BrowserRouter>
    <Route path="/" component={Home} />
  </BrowserRouter>
);

export default Router;
