import React from 'react';
import { TreeNode } from 'antd';

const TreeItem = ({ children, ...props }) => {
    return <TreeNode {...props}>{children}</TreeNode>;
};

export default TreeItem;
