import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AccountProvider } from './api/account/AccountContext';
import { ProjectBaseInformationProvider } from './api/project-base-information/ProjectBaseInformationContext';
import { Web3Provider } from './api/web3/Web3Context';
import { BrowserRouter } from 'react-router-dom';

console.log('Application initializing');

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProjectBaseInformationProvider>
        <Web3Provider>
          <AccountProvider>
            <App />
          </AccountProvider>
        </Web3Provider>
      </ProjectBaseInformationProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
