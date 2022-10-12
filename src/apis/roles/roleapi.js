import axiosInstanceDefault from '../axiosDefault';
import axiosInstanceAuth from '../axiosAuth';
import useAxios from '../useAxios';

const RoleApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (is_use, site_id, keyword = '') => {
        const encodeKeyword = encodeURIComponent(keyword);
        callApi('roleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/roles?isUse=${is_use}&siteId=${site_id}&searchText=${encodeKeyword}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListData = (is_use) => {
        callApi('roleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/roles?isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 데이터 조회
    const getListComboData = (is_use, type, site_id) => {
        callApi('roleList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/roles?siteId=${site_id}&isUse=${is_use}&type=${type}`,
            requestConfig: {}
        });
    };

    const getDelete = (id, data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}`,
            requestConfig: data
        });
    };

    // 데이터 등록
    const insertRole = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/role',
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${id}`,
            requestConfig: {}
        });
    };

    // 중복 조회
    const getDuplicateCheck = (id) => {
        callApi('duplicateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateRoleData = (id, data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}`,
            requestConfig: data
        });
    };

    // 데이터 삭제
    const deleteRoleData = (id, data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}`,
            requestConfig: data
        });
    };

    // role에 등록된 사용자 리스트 조회
    const roleRegisterSearch = (id, site_id, type) => {
        callApi('registerList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${id}/accounts`, // s?siteId=${site_id}&isUse=${is_use}&type=${type}`,
            requestConfig: {}
        });
    };

    // 사용자 맵핑 저장
    const roleRegisterSave = (id, data) => {
        console.log(id);
        console.log(data);
        callApi('registerData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/role/${id}/accounts`,
            requestConfig: data
        });
    };

    // 사용자 맵핑 저장 및 삭제
    const roleMappingRegisterSave = (id, data) => {
        callApi('registerRoleMappingData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/role/${id}/accounts`,
            requestConfig: data
        });
    };

    // 사용자 맵핑 롤 삭제
    const roleRegisterDelete = (role_id, user_id) => {
        callApi('registerDeleteRoleData', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/role/${role_id}/accounts/${user_id}`,
            requestConfig: {}
        });
    };

    // Role에 연관된 메뉴 트리 조회
    const roleRegisterTreeList = (role_id, site_id) => {
        callApi('roleRegisterTreeList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/role/${role_id}/sites/${site_id}`, // s?siteId=${site_id}&isUse=${is_use}&type=${type}`,
            requestConfig: {}
        });
    };

    // 권한 맵핑 저장
    const roleMenuSave = (role_id, data) => {
        callApi('roleMenuSave', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/role/${role_id}/resources`,
            requestConfig: data
        });
    };

    // 권한 redis 초기화
    const roleRedisInit = (role_id, data) => {
        callApi('roleRedisInit', {
            axiosInstance: axiosInstanceAuth,
            method: 'get',
            url: `/adm/redis/init`,
            requestConfig: data
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            roleSearch: getSearchData,
            roleList: getListData,
            roleComboSearch: getListComboData,
            roleDelete: deleteRoleData,
            roleInsert: insertRole,
            roleDetail: getDetailData,
            roleCheck: getDuplicateCheck,
            roleUpdate: updateRoleData,
            roleRegisterSearch: roleRegisterSearch,
            roleRegisterSave: roleRegisterSave,
            roleMappingRegisterSave: roleMappingRegisterSave,
            roleRegisterDelete: roleRegisterDelete,
            roleRegisterTreeList: roleRegisterTreeList,
            roleMenuSave: roleMenuSave,
            roleRedisInit: roleRedisInit
        }
    ];
};

export default RoleApi;
