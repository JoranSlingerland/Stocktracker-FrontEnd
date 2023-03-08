// utils\formatting.js
import { Image, Typography } from 'antd';

const { Text } = Typography;

function formatCurrency(value, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: maximumFractionDigits,
  });
}

function formatCurrencyWithColors(value, maximumFractionDigits = 2) {
  if (value > 0) {
    return (
      <Text type="success">{formatCurrency(value, maximumFractionDigits)}</Text>
    );
  }
  if (value < 0) {
    return (
      <Text type="danger">{formatCurrency(value, maximumFractionDigits)}</Text>
    );
  }
  return formatCurrency(value, maximumFractionDigits);
}

function formatPercentage(value, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    style: 'percent',
    minimumFractionDigits: maximumFractionDigits,
  });
}

function formatPercentageWithColors(value, maximumFractionDigits = 2) {
  if (value > 0) {
    return (
      <Text type="success">
        {formatPercentage(value, maximumFractionDigits)}
      </Text>
    );
  }
  if (value < 0) {
    return (
      <Text type="danger">
        {formatPercentage(value, maximumFractionDigits)}
      </Text>
    );
  }
  return formatPercentage(value, maximumFractionDigits);
}

function formatNumber(value, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    maximumFractionDigits: maximumFractionDigits,
  });
}

function formatImageAndText(text, image) {
  return (
    <div className="flex flex-row">
      <Image
        className="pr-1"
        alt="logo"
        src={image}
        width={35}
        height={35}
        preview={false}
        placeholder={false}
      />
      {text}
    </div>
  );
}

export {
  formatCurrency,
  formatPercentage,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatNumber,
  formatImageAndText,
};
