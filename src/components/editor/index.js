/* eslint-disable react/prop-types */
import { useEffect } from 'react';

const Editor = (props) => {
    let authData = null;
    if (localStorage.hasOwnProperty('authenticated')) {
        authData = JSON.parse(localStorage.getItem('authenticated'));
    }
    let Authorization = `Bearer ${authData.accessToken}`;
    // onload
    useEffect(() => {
        console.log(props);
        //console.log(authData);
        //console.log(synapEditorConfig['editor.autoSave.period'] = '1');
        //console.log(synapEditorConfig);
        synapEditorConfig['editor.upload.image.api'] =  process.env.REACT_APP_DEFAULT_API_URL + '/mng/cms/files';
        synapEditorConfig['editor.upload.image.headers'] = {
            Authorization: `${Authorization}`,
            site_id: process.env.REACT_APP_DEFAULT_SITE_ID,
            my_site_id: authData.siteId,
            active_role: authData.roleId
        };
        window[props.props.editName] = new SynapEditor(props.props.editName, synapEditorConfig, props.props.value.contentsData);
        // window[props.props.editName] = new SynapEditor(props.props.editName, synapEditorConfig, '');
        return(() => {
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