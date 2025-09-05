import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import store from './store/store';
import { Provider } from 'react-redux';
import { HMSRoomProvider } from '@100mslive/react-sdk';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <HMSRoomProvider>
          <App />
        </HMSRoomProvider>
      </Provider>
    </BrowserRouter>
  // </StrictMode>
)
