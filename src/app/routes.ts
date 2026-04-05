'use client';

import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { HomePage } from './pages/HomePage';
import { ServiceListingPage } from './pages/ServiceListingPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import LoginPage from './pages/LoginPage';
import { BecomePartnerPage } from './pages/BecomePartnerPage';

let router: any = null;

export function getRouter() {
  if (!router) {
    router = createBrowserRouter([
      {
        path: '/',
        Component: Root,
        children: [
          { index: true, Component: HomePage },
          { path: 'services/:category', Component: ServiceListingPage },
          { path: 'worker/:id', Component: WorkerProfilePage },
          { path: 'become-partner', Component: BecomePartnerPage },
        ],
      },
      {
        path: '/login',
        Component: LoginPage,
      },
    ]);
  }
  return router;
}
