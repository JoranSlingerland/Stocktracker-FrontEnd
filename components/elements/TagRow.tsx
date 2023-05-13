import { Tag } from 'antd';
import { TagProps } from 'antd';

interface TagRowProps {
  items: { value: string; tagProps?: TagProps }[];
}

function TagRow({ items }: TagRowProps) {
  // remove all undefined values from items
  items = items.filter((item) => item.value);
  console.log(items);
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
