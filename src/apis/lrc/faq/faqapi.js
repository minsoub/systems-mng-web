import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const FaqApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 데이터 조회
    const getListData = (language) => {
        callApi('getList', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/faq/content?language=${language}`,
            requestConfig: {}
        });
    };

    const getDetailData = (id) => {
        callApi('detailData', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/lrc/faq/content/${id}`,
            requestConfig: {}
        });
    };

    // LRC - 등록
    const insertData = (data) => {
        callApi('insertData', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: '/mng/lrc/faq/content',
            requestConfig: data
        });
    };
    // 수정
    const updateData = (data) => {
        callApi('updateData', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/lrc/faq/content/${data.id}`,
            requestConfig: data
        });
    };

    // 삭제
    const deleteData = (data) => {
        callApi('deleteData', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/lrc/faq/content/${data.id}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            faqSearch: getListData,
            faqDetail: getDetailData,
            faqInsert: insertData,
            faqUpdate: updateData,
            faqDelete: deleteData
        }
    ];
};

export default FaqApis;
