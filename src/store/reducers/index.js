// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import auth from './auth';
import projectSearchReducer from './projectsearch';
import logSearchReducer from './logsearch';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    auth,
    projectSearchReducer,
    logSearchReducer
});

export default reducers;
