// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import authsReducer from './auth';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    authsReducer
});

export default reducers;
