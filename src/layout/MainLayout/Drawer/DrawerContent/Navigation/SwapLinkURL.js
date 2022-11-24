//메뉴 활성화 치환 - 메뉴가 따로 없는 페이지(상세 페이지 같은)
export const getSwapLink = (paramLink) => {
    // console.log(paramLink);
    if (paramLink.indexOf('damage-case/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('campaign/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('digital-asset-basic/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('insight-column/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('digital-asset-trend/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('notice/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('press-release/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('access/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('faq/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('accountmng/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('site/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('account/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('board/reg') > -1) return paramLink.replace('reg', 'list');
    if (paramLink.indexOf('projects/detail') > -1) return paramLink.replace('detail', 'list');
    if (paramLink.indexOf('sitelog/log') > -1) return paramLink.replace('/log', '/list');
    if (paramLink.indexOf('event/reg') > -1) return paramLink.replace('/reg', '/list');
    if (paramLink.indexOf('review-report/reg') > -1) return paramLink.replace('/reg', '/list');
    if (paramLink.indexOf('investment-warning/reg') > -1) return paramLink.replace('/reg', '/list');
    if (paramLink.indexOf('economic-research/reg') > -1) return paramLink.replace('/reg', '/list');
    return paramLink;
};
