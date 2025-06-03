import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'
import { LoginProvider } from './context/LoginContext.jsx';
import { store } from './redux/store.js';
import ThemeProvider from './context/ThemeContext';
import { PatientProvider } from './context/PatientContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LoginProvider>
      <ThemeProvider>
        <PatientProvider>
        <App /> 
        <ToastContainer />
        </PatientProvider>
        </ThemeProvider>
       
      </LoginProvider>
    </Provider>
  </StrictMode>,
)
