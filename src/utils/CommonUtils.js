import moment from 'moment';

// 날짜 포멧 처리 utc + 9
export const  getDateFormat = (paramDate) => {
    if(paramDate){
        const dateFormat = 'YYYY-MM-DD HH:mm';
        const newDate = moment(paramDate).add(9, 'h').format(dateFormat);
        console.log('getDateFormat:', paramDate, newDate);
        return newDate;
    }
    return '';
};