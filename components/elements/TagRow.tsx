import { Tag } from 'antd';
import { TagProps } from 'antd';

interface TagRowProps {
  items: { value: string | undefined; tagProps?: TagProps }[];
}

function TagRow({ items }: TagRowProps) {
  items = items.filter((item) => item.value);
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
