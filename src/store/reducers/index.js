// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import auth from './auth';
import projectSearchReducer from './projectsearch';
import logSearchReducer from './logsearch';
import boardSearchReducer from './boardsearch';
import cpcBlockChainNewsSearchReducer from './cpc/BlockChainNewsSearch';
import cpcCampaignSearchReducer from './cpc/CampaignSearch';
import cpcDamageCaseSearchReducer from './cpc/DamageCaseSearch';
import cpcDigitalAssetBasicSearchReducer from './cpc/DigitalAssetBasicSearch';
import cpcDigitalAssetTrendSearchReducer from './cpc/DigitalAssetTrendSearch';
import cpcInsightColumnSearchReducer from './cpc/InsightColumnSearch';
import cpcNoticeSearchReducer from './cpc/NoticeSearch';
import cpcFraudReportSearchReducer from './cpc/FraudReportSearch';
import cpcLegalCounselingSearchReducer from './cpc/LegalCounselingSearch';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    auth,
    projectSearchReducer,
    logSearchReducer,
    boardSearchReducer,
    cpcBlockChainNewsSearchReducer,
    cpcCampaignSearchReducer,
    cpcDamageCaseSearchReducer,
    cpcDigitalAssetBasicSearchReducer,
    cpcDigitalAssetTrendSearchReducer,
    cpcInsightColumnSearchReducer,
    cpcNoticeSearchReducer,
    cpcFraudReportSearchReducer,
    cpcLegalCounselingSearchReducer
});

export default reducers;
