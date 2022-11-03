import { forwardRef } from 'react';
import { Card } from '@mui/material';

// 콘텐츠 테두리 라인
const ContentLine = forwardRef(({ children, className }, ref) => {
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
