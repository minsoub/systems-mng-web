import React from 'react';

import { Tree as AntdTree } from 'antd';

const { TreeNode } = AntdTree;

const Tree = ({ treeData, onSelect }) => {
    const handleSelectNode = (selectedKeys) => {
        onSelect(selectedKeys[0]);
    };

    const renderTreeNodes = (data) =>
        data.map((item) => {
            let contents;
            contents = (
                <div key={item.id}>
                    <p>{`${item.name}`}</p>
                </div>
            );
            if (item.children) {
                return (
                    <TreeNode title={contents} key={item.id}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={contents} key={item.id} />;
        });

    return (
        <AntdTree showIcon showLine={{ showLeafIcon: true }} onSelect={handleSelectNode} defaultExpandAll>
            {renderTreeNodes(treeData)}
        </AntdTree>
    );
};

export default Tree;
