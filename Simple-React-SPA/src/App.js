import React, { useEffect, useState } from 'react';
import About from './components/About';
import Home from './components/Home';
import Contacts from './components/Contacts';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Portfolio from './components/Portfolio';
import keycloak from './keycloak';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'contacts', element: <Contacts /> },
      { path: '*', element: <h1>Sorry Not Found</h1> },
    ],
  },
]);

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
      if (authenticated) {
        keycloak.updateToken(5).then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed');
          } else {
            console.warn('Token not refreshed, valid for ' +
              Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
          }
          setAuthenticated(true);
        }).catch(() => {
          console.error('Failed to refresh token');
          keycloak.logout();
        });
      } else {
        setAuthenticated(false);
      }
      setKeycloakInitialized(true);
    }).catch(() => {
      console.log('Failed to initialize Keycloak');
      setKeycloakInitialized(true); // Even if it fails, we set this to true to avoid infinite loading
    });
  }, []);

  const handleLogout = () => {
    keycloak.logout();
  };

  if (!keycloakInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {authenticated && <button onClick={handleLogout}>Logout</button>}
      <RouterProvider router={router} />
    </>
  );
}