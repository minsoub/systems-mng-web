// 소수점 이하 자리수 계산
export const decimalPoint = (value) => {
    const valueLength = value.split('.')[1];

    let result = '소수점 0자리';

    if (valueLength) {
        switch (valueLength.length) {
            case 1:
                result = '소수점 1자리';
                break;
            case 2:
                result = '소수점 2자리';
                break;
            case 3:
                result = '소수점 3자리';
                break;
            case 4:
                result = '소수점 4자리';
                break;
            case 5:
                result = '소수점 5자리';
                break;
            case 6:
                result = '소수점 6자리';
                break;
            case 7:
                result = '소수점 7자리';
                break;
            case 8:
                result = '소수점 8자리';
                break;
            case 9:
                result = '소수점 9자리';
                break;
            case 10:
                result = '소수점 10자리';
                break;
            case 11:
                result = '소수점 11자리';
                break;
            case 12:
                result = '소수점 12자리';
                break;
            case 13:
                result = '소수점 13자리';
                break;
            case 14:
                result = '소수점 14자리';
                break;
            case 15:
                result = '소수점 15자리';
                break;
            case 16:
                result = '소수점 16자리';
                break;
            case 17:
                result = '소수점 17자리';
                break;
            case 18:
                result = '소수점 18자리';
                break;
            default:
                break;
        }
    }
    return result;
};
