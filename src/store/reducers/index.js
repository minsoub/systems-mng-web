// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import auths from './auth';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    auths
});

export default reducers;
