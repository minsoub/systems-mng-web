import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';
import { doEncrypt, doEncryptRSA } from 'utils/Crypt';

const AccountApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (is_use, keyword) => {
        if (is_use === null) is_use = '';
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accounts?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };
    const getUserSearchData = (is_use, keyword) => {
        if (is_use === null) is_use = '';
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accounts/user?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };
    const getUserSiteSearchData = (siteId, is_use, keyword) => {
        if (is_use === null) is_use = '';
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accounts/${siteId}/user?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };
    // 데이터 조회
    const getListData = (is_use) => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accounts?isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 계정 데이터 상세 조회
    const getDetailData = (id) => {
        callApi('getData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/account/${id}`,
            requestConfig: {}
        });
    };

    // 선택된 그리드 데이터 삭제
    const getDeleteData = (selectedRows) => {
        if (selectedRows && selectedRows.length > 0) {
            let paramIds = selectedRows.join('&ids=');
            callApi('deleteData', {
                axiosInstance: axiosInstanceDefault,
                method: 'delete',
                url: `/faq/content?ids=${paramIds}`,
                requestConfig: {}
            });
        }
    };

    // 통합시스템 관리 - 계정 등록
    const insertData = (data) => {
        let a = doEncryptRSA(data.email);
        let b = doEncryptRSA(data.name);
        let c = doEncryptRSA(data.password);
        console.log(c);
        Promise.all([a, b, c]).then((values) => {
            data.email = values[0];
            data.name = values[1];
            data.password = values[2];
            callApi('insertData', {
                axiosInstance: axiosInstanceDefault,
                method: 'post',
                url: '/account',
                requestConfig: data
            });
        });
    };
    // 통합시스템 관리 - 계정 수정
    const updateData = (id, data) => {
        let a = doEncryptRSA(data.email);
        let b = doEncryptRSA(data.name);
        let c = doEncryptRSA(data.password);
        console.log(c);
        Promise.all([a, b, c]).then((values) => {
            data.email = values[0];
            data.name = values[1];
            data.password = values[2];
            callApi('updateData', {
                axiosInstance: axiosInstanceDefault,
                method: 'put',
                url: `/account/${id}`,
                requestConfig: data
            });
        });
    };

    // 사이트 관리 - 사용자 접근 관리 정보 수정
    const updateAccessData = (id, data) => {
        let a = doEncryptRSA(data.email);
        let b = doEncryptRSA(data.name);
        Promise.all([a, b]).then((values) => {
            data.email = values[0];
            data.name = values[1];
            callApi('updateAccessData', {
                axiosInstance: axiosInstanceDefault,
                method: 'put',
                url: `/access/${id}`,
                requestConfig: data
            });
        });
    };

    // 통합시스템 관리 - 접근 관리 수정 (롤정보 업데이트)
    const updateRoleData = (id, data) => {
        callApi('updateRoleData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/account/${id}/role`,
            requestConfig: data
        });
    };

    // 통합시스템 관리 - 접근 관리 수정 (롤정보 업데이트)
    const updateRolesData = (id, data) => {
        callApi('updateRoleData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/account/${id}/roles`,
            requestConfig: data
        });
    };

    // 데이터 검색
    const getSearchMngData = (is_use, keyword) => {
        if (is_use === null) is_use = '';
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accountmng?searchText=${encodeKeyword}&isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 통합 시스템 관리 - 계정 상세 데이터 조회(롤 리스트 조회)
    const getDetailRoleMng = (id) => {
        callApi('getRoleData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/account/${id}/roles`,
            requestConfig: {}
        });
    };

    // 통합관리 > 계정 삭제 : 일괄 삭제
    const deleteAccounts = (idsList) => {
        callApi('deleteDatas', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/account/${idsList}`,
            requestConfig: {}
        });
    };

    // 통합관리 - 계정 데이터 상세 조회
    const getDetailDataMng = (id) => {
        callApi('getData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/accountmng/${id}`,
            requestConfig: {}
        });
    };

    // 통합관리 - 계정 데이터 수정
    const updateMng = (id, data) => {
        let a = doEncryptRSA(data.email);
        let b = doEncryptRSA(data.name);
        let c = doEncryptRSA(data.password);

        console.log(c);
        Promise.all([a, b, c]).then((values) => {
            data.email = values[0];
            data.name = values[1];
            data.password = values[2];
            callApi('updateData', {
                axiosInstance: axiosInstanceDefault,
                method: 'put',
                url: `/accountmng/${id}`,
                requestConfig: data
            });
        });
    };

    // 통합관리 > 계정 등록
    const insertMngAccount = (data) => {
        let a = doEncryptRSA(data.email);
        let b = doEncryptRSA(data.name);
        let c = doEncryptRSA(data.password);
        console.log(c);
        Promise.all([a, b, c]).then((values) => {
            data.email = values[0];
            data.name = values[1];
            data.password = values[2];
            callApi('insertData', {
                axiosInstance: axiosInstanceDefault,
                method: 'post',
                url: '/accountmng',
                requestConfig: data
            });
        });
    };

    // 통합관리 > 계정 삭제 : 일괄 삭제
    const deleteMngAccounts = (idsList) => {
        callApi('deleteDatas', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/accountmng/${idsList}`,
            requestConfig: {}
        });
    };
    // 패스워드 수정
    const updatePasswordInfo = (data) => {
        callApi('updatePasswordData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/account`,
            requestConfig: data
        });
    };

    // 계정 Role List 조회
    const getAccessRole = (id) => {
        callApi('getRoleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/account/${id}/roles`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            accountSearch: getSearchData,
            accountUserSearch: getUserSearchData,
            accountUserSiteSearch: getUserSiteSearchData,
            accountList: getListData,
            accountDetail: getDetailData,
            accountDelete: getDeleteData,
            accountDeletes: deleteAccounts,
            accountInsert: insertData,
            accountUpdate: updateData,
            accessUpdate: updateAccessData,
            accountMngSearch: getSearchMngData,
            accountMngDetail: getDetailDataMng,
            accountMngUpdate: updateMng,
            accountMngInsert: insertMngAccount,
            accountMngDeletes: deleteMngAccounts,
            accountMngRole: getDetailRoleMng,
            accountRoleUpdate: updateRoleData,
            accountRolesUpdate: updateRolesData,
            updatePasswordInfo: updatePasswordInfo,
            getAccessRole: getAccessRole
        }
    ];
};

export default AccountApis;
