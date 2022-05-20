import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <App/>
    <ToastContainer
      position="bottom-left"
      autoClose={false}
      closeOnClick
      rtl={false}
      pauseOnHover
    />
  </React.StrictMode>
)