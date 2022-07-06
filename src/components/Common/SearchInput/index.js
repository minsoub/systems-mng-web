import { Input, Space } from 'antd';
const { Search } = Input;

const SearchInput = ({ onSearch }) => (
    <Space direction="vertical">
        <Search placeholder="검색어를 입력해주세요" onSearch={onSearch} enterButton />
    </Space>
);

export default SearchInput;
