// material-ui
import { Stack, Box, IconButton, Link, useMediaQuery } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';
import './styles.scss';
// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('xs'));

    return (
        <div className="searchAndUser">
            {/* 검색바 */}
            {/* {!matchesXs && <Search />} */}
            {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

            {/* 유저 정보*/}
            {!matchesXs && <Profile />}
            {matchesXs && <MobileSection />}
        </div>
    );
};

export default HeaderContent;
