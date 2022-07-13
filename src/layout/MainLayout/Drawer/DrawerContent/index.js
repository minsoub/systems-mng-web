// project import
import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = ({ navigation }) => {
    const { siteId } = useSelector((state) => state.auth);
    console.log(`site change => ${siteId}`);

    return (
        <SimpleBar
            sx={{
                '& .simplebar-content': {
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            <Navigation navigation={navigation} />
            {/* <NavCard /> */}
        </SimpleBar>
    );
};

export default DrawerContent;
