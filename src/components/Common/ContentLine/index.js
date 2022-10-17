import { forwardRef } from 'react';
import { Card } from '@mui/material';

// 컨텐츠 테두리 라인
const ContentLine = forwardRef(({ children, className }) => {
    return (
        <Card
            className={className}
            sx={{
                boxShadow: 'none',
                borderRadius: '2px 2px 0 0',
                overflowX: 'auto'
            }}
        >
            {children}
        </Card>
    );
});

export default ContentLine;
