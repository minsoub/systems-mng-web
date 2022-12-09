// 소수점 이하 자리수 계산
export const decimalPoint = (value) => {
    const valueLength = value.split('.')[1];

    let result = '소수점 영자리';

    if (valueLength) {
        switch (valueLength.length) {
            case 1:
                result = '소수점 한자리';
                break;
            case 2:
                result = '소수점 두자리';
                break;
            case 3:
                result = '소수점 세자리';
                break;
            case 4:
                result = '소수점 네자리';
                break;
            case 5:
                result = '소수점 다섯자리';
                break;
            case 6:
                result = '소수점 여섯자리';
                break;
            case 7:
                result = '소수점 일곱자리';
                break;
            case 8:
                result = '소수점 여덟자리';
                break;
            case 9:
                result = '소수점 아홉자리';
                break;
            case 10:
                result = '소수점 열자리';
                break;
            case 11:
                result = '소수점 열한자리';
                break;
            case 12:
                result = '소수점 열두자리';
                break;
            case 13:
                result = '소수점 열세자리';
                break;
            case 14:
                result = '소수점 열네자리';
                break;
            case 15:
                result = '소수점 열다섯자리';
                break;
            case 16:
                result = '소수점 열여섯자리';
                break;
            case 17:
                result = '소수점 열일곱자리';
                break;
            case 18:
                result = '소수점 열여덟자리';
                break;
            default:
                break;
        }
    }
    return result;
};
