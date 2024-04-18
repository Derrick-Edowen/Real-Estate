import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter} from 'react-router-dom';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

window.googleTranslateElementInit = function() {
  new window.google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
};

// Use ReactDOM.createRoot for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
