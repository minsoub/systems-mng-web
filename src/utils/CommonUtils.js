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
        const dateFormat = 'YYYY.MM.DD HH:mm:ss';
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

function byteString(index) {
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    // eslint-disable-next-line security/detect-object-injection
    return units[index];
}
export const humanFileSize = (bytes, si = false, dp = 1) => {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    //const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < 8 - 1); // units.length - 1);

    return bytes.toFixed(dp) + ' ' + byteString(u); // units[u];
};
