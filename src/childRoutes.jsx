import React from 'react';
import { Route } from '@americanexpress/one-app-router';
import ModuleRoute from 'holocron-module-route';

const childRoutes = () => [
  <Route path="/" />,
  <ModuleRoute path="/repos" moduleName="list-of-github-repos" />,
];

export default childRoutes;
