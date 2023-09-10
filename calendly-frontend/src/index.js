import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import {UserContextProvider} from './components/UserContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <UserContextProvider>
      <App/>
    </UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
