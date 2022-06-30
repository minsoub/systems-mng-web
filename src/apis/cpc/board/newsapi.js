import React from 'react';
import axiosInstanceDefault from '../../axiosDefault';
import useAxios from '../../useAxios';

const NewsApis = () => {
    const [responseData, requestError, loading, callApi] = useAxios();

    // 게시글 목록 조회
    const getNewss = (request) => {
        const start_date = request.start_date;
        const end_date = request.end_date;
        const keyword = request.keyword == undefined ? '' : encodeURIComponent(request.keyword);
        callApi('getNewss', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/news?start_date=${start_date}&end_date=${end_date}&query=${keyword}`,
            requestConfig: {}
        });
    };

    // 게시글 목록 삭제
    const deleteNewss = (deleteIds) => {
        callApi('deleteNewss', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/cpc/news/bulk-delete?deleteIds=${deleteIds}`,
            requestConfig: {}
        });
    };

    // 게시글 정보 조회
    const getNews = (id) => {
        callApi('getNews', {
            axiosInstance: axiosInstanceDefault,
            method: 'get',
            url: `/mng/cpc/news/${id}`,
            requestConfig: {}
        });
    };

    // 게시글 등록
    const createNews = (data) => {
        callApi('createNews', {
            axiosInstance: axiosInstanceDefault,
            method: 'post',
            url: `/mng/cpc/news`,
            requestConfig: data
        });
    };

    // 게시글 수정
    const updateNews = (data) => {
        callApi('updateNews', {
            axiosInstance: axiosInstanceDefault,
            method: 'put',
            url: `/mng/cpc/news/${data.id}`,
            requestConfig: data
        });
    };

    // 게시글 삭제
    const deleteNews = (id) => {
        callApi('deleteNews', {
            axiosInstance: axiosInstanceDefault,
            method: 'delete',
            url: `/mng/cpc/news/${id}`,
            requestConfig: {}
        });
    };

    return [
        responseData,
        requestError,
        loading,
        {
            searchNewsList: getNewss,
            deleteNewsList: deleteNewss,
            searchNews: getNews,
            createNews: createNews,
            updateNews: updateNews,
            deleteNews: deleteNews
        }
    ];
};

export default NewsApis;
