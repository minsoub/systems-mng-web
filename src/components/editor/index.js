/* eslint-disable react/prop-types */
import { useEffect } from 'react';

// =============|| DetailContents - EventContents ||============= //

const Editor = (props) => {
    let authData = null;
    let Authorization = '';

    // onload
    useEffect(() => {
        if (localStorage.hasOwnProperty('authenticated')) {
            authData = JSON.parse(localStorage.getItem('authenticated'));
        }
        Authorization = `Bearer ${authData.accessToken}`;
        // console.log(props);
        synapEditorConfig['editor.upload.image.api'] =  process.env.REACT_APP_DEFAULT_API_URL + '/mng/cms/files/image';
        synapEditorConfig['editor.upload.image.headers'] = {
            Authorization: `${Authorization}`,
            site_id: process.env.REACT_APP_DEFAULT_SITE_ID,
            my_site_id: authData.siteId,
            active_role: authData.roleId
        };
        window[props.props.editName] = new SynapEditor(props.props.editName, synapEditorConfig, props.props.value.contentsData);
        return (() => {
            delete window[props.props.editName];
        });
    }, []);
    return (
        <div>
            <div style={{width:'98%', height: '400px', 'textAlign': 'left', color: 'black'}}>
                <div id={props.props.editName}></div>
            </div>
        </div>
    );
};

export default Editor;
