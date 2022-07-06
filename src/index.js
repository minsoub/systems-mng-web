import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import 'globalstyle.scss';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import 'assets/third-party/apex-chart.css';

// project import
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'provider/AuthProvider';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

ReactDOM.render(
    <StrictMode>
        <ReduxProvider store={store}>
            {/* <AuthProvider> */}
            <BrowserRouter basename="/">
                <App />
            </BrowserRouter>
            {/* </AuthProvider> */}
        </ReduxProvider>
    </StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
