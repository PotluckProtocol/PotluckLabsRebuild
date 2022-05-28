import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AccountProvider } from './api/account/AccountContext';
import { ProjectBaseInformationProvider } from './api/project-base-information/ProjectBaseInformationContext';
import { BrowserRouter } from 'react-router-dom';
import { TraversingInfoProvider } from './api/traversing/TraversingInfoContext';

console.log('Application initializing');

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProjectBaseInformationProvider>
        <TraversingInfoProvider>
          <AccountProvider>
            <App />
          </AccountProvider>
        </TraversingInfoProvider>
      </ProjectBaseInformationProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
