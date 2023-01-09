import Tree from 'components/Tree/Tree';
import React, { useEffect, useState } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { Grid, Button } from '@mui/material';
import StyledTtreeItem from 'components/TreeMenu/StyledTreeItem';
import TreeView from '@mui/lab/TreeView';
import ButtonLayout from '../../../components/Common/ButtonLayout';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

const LineTree = ({ dataGridRows, onParentPlusSelect, onSelect }) => {
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };
    // 1차 계열 생성
    const newClick = () => {
        onSelect('');
    };
    const handleSelect = (nodeIds) => {
        console.log('handleSelect called....');
        console.log(nodeIds);
        // 상위 컴포넌트에 선택한 key 값 전달
        onSelect(nodeIds);
        // statusdata.map((item, idx) => {
        //     console.log(item.id + '====' + nodeIds);
        //     if (item.id === nodeIds) {
        //         console.log('found...1');
        //         console.log(item);
        //         setInputs({
        //             id: item.id,
        //             name: item.name,
        //             name_en: item.name_en === null ? '' : item.name_en,
        //             parent_code: item.parent_code,
        //             parent_code_name: '',
        //             order_no: item.order_no,
        //             use_yn: item.use_yn
        //         });
        //         setSelected(nodeIds);
        //         setIsUpdate(true); // 수정모드
        //         setBtnSave('저장');
        //         return;
        //     } else if (item.children && item.children.length > 0) {
        //         item.children.map((sub, index) => {
        //             if (sub.id === nodeIds) {
        //                 console.log(sub);
        //                 setInputs({
        //                     id: sub.id,
        //                     name: sub.name,
        //                     name_en: sub.name_en === null ? '' : sub.name_en,
        //                     parent_code: sub.parent_code,
        //                     parent_code_name: item.name,
        //                     order_no: sub.order_no,
        //                     use_yn: sub.use_yn
        //                 });
        //                 setSelected(nodeIds);
        //                 setIsUpdate(true); // 수정모드
        //                 setBtnSave('저장');
        //                 return;
        //             }
        //         });
        //     }
        // });
        setSelected(nodeIds);
        setExpanded(nodeIds);
    };

    const onPlusSelect = (nodeIds) => {
        console.log('onPlusSelect called => ' + nodeIds);
        if (dataGridRows) {
            let found = 0;
            dataGridRows.map((item, idx) => {
                if (item.id === nodeIds) {
                    found = 1;
                    console.log('found...1');
                    console.log(item);
                    onParentPlusSelect(nodeIds);
                    // setInputs({
                    //     id: '',
                    //     name: '',
                    //     name_en: '',
                    //     parent_code: item.id,
                    //     parent_code_name: item.name,
                    //     order_no: '1',
                    //     use_yn: 'true'
                    // });
                    setSelected(nodeIds);
                    // setIsUpdate(false); // 수정모드
                    // setBtnSave('저장');
                    return;
                }
            });
        }
    };
    const renderTreeItem = (items) => {
        //console.log(items);
        const menu = items.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <StyledTtreeItem
                        key={item.id}
                        nodeId={item.id}
                        dataMsg={item.id}
                        labelIcon={FolderIcon}
                        labelText={item.name}
                        labelPlus={'block'}
                        labelMinus={'none'}
                        plusSelect={onPlusSelect}
                        nodeSelect={handleSelect}
                    >
                        {renderTreeItem(item.children)}
                    </StyledTtreeItem>
                );
            } else {
                //console.log(item);
                if (!item.parent_id) {
                    return (
                        <StyledTtreeItem
                            key={item.id}
                            nodeId={item.id}
                            dataMsg={item.id}
                            labelIcon={FolderIcon}
                            labelText={item.name}
                            labelPlus={'block'}
                            labelMinus={'none'}
                            plusSelect={onPlusSelect}
                            nodeSelect={handleSelect}
                        />
                    );
                } else {
                    return (
                        <StyledTtreeItem
                            key={item.id}
                            nodeId={item.id}
                            dataMsg={item.id}
                            labelIcon={InsertDriveFileIcon}
                            labelText={item.name}
                            labelPlus={'none'}
                            labelMinus={'none'}
                            plusSelect={onPlusSelect}
                            nodeSelect={handleSelect}
                        />
                    );
                }
            }
            return null;
        });
        return menu;
    };
    return (
        <Grid xs={4}>
            <div style={{ width: '100%', padding: 30, background: '#ffffff' }}>
                {/*<Tree onSelect={onSelect} treeData={dataGridRows} />*/}
                <TreeView
                    aria-label="controlled"
                    sx={{ height: 400, flexGrow: 1, overflowY: 'auto' }}
                    onNodeToggle={handleToggle}
                >
                    {renderTreeItem(dataGridRows)}
                </TreeView>
                <ButtonLayout>
                    <Button disableElevation size="medium" type="submit" variant="outlined_d" color="primary" onClick={newClick}>
                        1차 계열 생성
                    </Button>
                </ButtonLayout>
            </div>
        </Grid>
    );
};

export default LineTree;
