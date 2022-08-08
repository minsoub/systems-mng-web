import axiosInstanceDefault from '../axiosDefault';
import useAxios from '../useAxios';

const MenuMngApi = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 검색
    const getSearchData = (site_id, is_use) => {
        //const encodeKeyword = encodeURIComponent(keyword);
        callApi('menuList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/menu-list?isUse=${is_use}`,
            requestConfig: {}
        });
    };

    // 메뉴 데이터 일괄 삭제
    const getDeleteMenu = (id, data) => {
        let deleteIds = { menu_ids: data };
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${id}/menu`,
            requestConfig: deleteIds
        });
    };

    // 데이터 등록
    const insertMenu = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/site/${data.site_id}/menu`,
            requestConfig: data
        });
    };

    // 데이터 상세 조회
    const getDetailData = (id, site_id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/menu/${id}`,
            requestConfig: {}
        });
    };

    // 데이터 수정
    const updateProgramData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${data.site_id}/menu/${data.id}`,
            requestConfig: data
        });
    };
    // 메뉴와 프로그램매핑
    const registerProgramMenuMapping = (menu_id, site_id, data) => {
        let send_data = { program_ids: data };
        console.log(send_data);
        callApi('registerData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/site/${site_id}/menu/${menu_id}/programs`,
            requestConfig: send_data
        });
    };
    // 메뉴와 프로그램 연결된 프로그램 조회
    const registerProgramMenuSearch = (menu_id, site_id) => {
        callApi('mappingList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/site/${site_id}/menu/${menu_id}/programs`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            menumngSearch: getSearchData,
            menumngDelete: getDeleteMenu,
            menumngInsert: insertMenu,
            menumngDetail: getDetailData,
            menumngUpdate: updateProgramData,
            programMapping: registerProgramMenuMapping,
            programMappingSearch: registerProgramMenuSearch
        }
    ];
};

export default MenuMngApi;
