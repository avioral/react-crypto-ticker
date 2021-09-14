import React from 'react';

import './App.css';
import Routes from "./Routes";
import axios from "axios";

axios.interceptors.request.use(function (config) {
    config.headers.authorization =  `Apikey ${process.env.REACT_APP_API_KEY}`;
    return config;
});

function App() {

  return (
          <Routes />
  );
}

export default App;
