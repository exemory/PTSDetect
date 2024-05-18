import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import '@fontsource-variable/inter';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/i18n/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
