import { Image, Typography, Space } from 'antd';
const { Text } = Typography;

function formatCurrency({
  value,
  maximumFractionDigits,
  currency,
}: {
  value: number | string;
  maximumFractionDigits?: number;
  currency?: string;
}) {
  if (currency === undefined || currency === '') {
    return formatNumber(value, maximumFractionDigits);
  }
  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: maximumFractionDigits,
  });
}

function getCurrencySymbol(currency: string | undefined) {
  if (currency === undefined || currency === '') {
    return '';
  }
  const value = 1;
  const formattedValue = value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formattedValue.replace(/[\d\s,.]+/g, '');
}

function formatCurrencyWithColors({
  value,
  maximumFractionDigits = 2,
  currency,
}: {
  value: number | string;
  maximumFractionDigits?: number;
  currency?: string;
}) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  if (currency === undefined) {
    var formattedValue = formatCurrency({ value, maximumFractionDigits });
  } else {
    var formattedValue = formatCurrency({
      value,
      maximumFractionDigits,
      currency,
    });
  }

  if (value > 0) {
    return <Text type="success">{formattedValue}</Text>;
  }
  if (value < 0) {
    return <Text type="danger">{formattedValue}</Text>;
  }
  return formattedValue;
}

function formatPercentage(value: number | string, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    style: 'percent',
    minimumFractionDigits: maximumFractionDigits,
  });
}

function formatPercentageWithColors(
  value: number | string,
  maximumFractionDigits = 2
) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
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

function formatNumber(value: number | string, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    maximumFractionDigits: maximumFractionDigits,
  });
}

function formatImageAndText(text: string, image: string): JSX.Element {
  if (image === undefined) {
    image = '/images/fallback.png';
  }
  return (
    <Space wrap>
      <Image
        className="pr-1"
        alt="logo"
        src={image}
        width={35}
        height={35}
        preview={false}
        placeholder={false}
      />
      <Text className="pl-1" strong>
        {text}
      </Text>
    </Space>
  );
}

export {
  formatCurrency,
  formatPercentage,
  formatCurrencyWithColors,
  formatPercentageWithColors,
  formatNumber,
  formatImageAndText,
  getCurrencySymbol,
};
