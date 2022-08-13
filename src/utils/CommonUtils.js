import moment from 'moment';

// 날짜 포멧 처리 utc + 9
export const getDateFormat = (paramDate) => {
    if (paramDate) {
        const dateFormat = 'YYYY-MM-DD HH:mm';
        const newDate = moment(paramDate).add(9, 'h').format(dateFormat);
        return newDate;
    }
    return '';
};
export const getDateFormatSecond = (paramDate) => {
    if (paramDate) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const newDate = moment(paramDate).add(9, 'h').format(dateFormat);
        return newDate;
    }
    return '';
};
// br 변환
export const nl2br = (content) => {
    if (!content) {
        return '';
    }
    //console.log('nl2br:', content, content.split('\n'));
    return content.split('\n').map((item, index) => {
        return (
            // eslint-disable-next-line react/no-array-index-key
            <i key={index}>
                {item}
                <br />
            </i>
        );
    });
};

// br 변환
export const nl2brToString = (content) => {
    if (!content) {
        return '';
    }
    return content.split('\n').join('<br />');
};
