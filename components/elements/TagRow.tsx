import { Tag } from 'antd';
import { TagProps } from 'antd';

interface TagRowProps {
  items: { value: string; tagProps?: TagProps }[];
}

function TagRow({ items }: TagRowProps) {
  return (
    <div>
      {items.map(({ value, tagProps }) => (
        <Tag key={value} {...tagProps}>
          {value}
        </Tag>
      ))}
    </div>
  );
}

export default TagRow;
