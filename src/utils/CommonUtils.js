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

export const byteString = (index) => {
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; //  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    // eslint-disable-next-line security/detect-object-injection
    return units[index];
};
export const clipboardShare = (text) => {
    // 1. 새로운 element 생성
    const tmpTextarea = document.createElement('textarea');
    // 2. 해당 element에 복사하고자 하는 value 저장
    tmpTextarea.value = text;
    // 3. 해당 element를 화면에 안보이는 곳에 위치
    tmpTextarea.setAttribute('readonly', '');
    tmpTextarea.style.position = 'absolute';
    tmpTextarea.style.left = '-9999px';
    document.body.appendChild(tmpTextarea);
    // 4. 해당 element의 value를 시스템 함수를 호출하여 복사
    tmpTextarea.select();
    tmpTextarea.setSelectionRange(0, 9999); // 셀렉트 범위 설정
    const successChk = document.execCommand('copy');
    // 5. 해당 element 삭제
    document.body.removeChild(tmpTextarea);
    // 클립보드 성공여부 확인
    if (!successChk) {
        alert('클립보드 복사에 실패하였습니다.');
    } else {
        alert('URL 주소가 클립보드에 복사되었습니다.');
    }
};