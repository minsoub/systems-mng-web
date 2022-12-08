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
import cpcEconomicResearchSearchReducer from './cpc/EconomicResearchSearch';
import cpcEducationSearchReducer from './cpc/EducationSearch';
import cpcEventSearchReducer from './cpc/EventSearch';
import cpcFraudReportSearchReducer from './cpc/FraudReportSearch';
import cpcInsightColumnSearchReducer from './cpc/InsightColumnSearch';
import cpcLegalCounselingSearchReducer from './cpc/LegalCounselingSearch';
import cpcNoticeSearchReducer from './cpc/NoticeSearch';
import cpcPressReleaseSearchReducer from './cpc/PressReleaseSearch';
import cpcCointingSearchReducer from './cpc/CointingSearch';

import lrcProjectUserMngSearchReducer from './lrc/ProjectUserMngSearch';
import lrcSystemCheckMngSearchReducer from './lrc/SystemCheckMng';
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
    cpcEconomicResearchSearchReducer,
    cpcEducationSearchReducer,
    cpcEventSearchReducer,
    cpcFraudReportSearchReducer,
    cpcInsightColumnSearchReducer,
    cpcLegalCounselingSearchReducer,
    cpcNoticeSearchReducer,
    cpcPressReleaseSearchReducer,
    cpcCointingSearchReducer,
    lrcProjectUserMngSearchReducer,
    lrcSystemCheckMngSearchReducer
});

export default reducers;
