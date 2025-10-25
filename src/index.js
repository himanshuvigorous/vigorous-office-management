
import ReactDOM from 'react-dom/client';
import './index.css';
import './formclasses.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
 console.warn = () => {};
  console.error = (err) => {
    if (err.includes('Critical error')) {
      console.log(err); 
    }
  };
root.render(
  <ConfigProvider> 
  <Provider store={store}> 
    <App />
  </Provider>
  </ConfigProvider>
);
reportWebVitals();
