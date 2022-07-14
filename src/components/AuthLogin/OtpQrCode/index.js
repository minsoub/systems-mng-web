import { InputLabel, Stack, Typography } from '@mui/material';
import './styles.scss';
import cx from 'classnames';

const OtpQrCode = () => {
    return (
        <div className={cx('optTitle')}>
            <div>
                <h4>1. OTP 앱을 설치해 주세요</h4>
                <p>App Store, Google Play Store에서 Google Authenticator를 다운로드 합니다.</p>
            </div>
            <div>
                <h4>2. 바코드를 스캔하고 앱에 표시된 6자리 코드를 입력해 주세요.</h4>
                <p>설치된 앱에서 "+" 버튼을 누르고 QR 코드 스캔 메뉴를 통해 바코드를 스캔합니다.</p>
            </div>
        </div>
    );
};

export default OtpQrCode;
