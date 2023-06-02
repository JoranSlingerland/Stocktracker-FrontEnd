import { Image, Typography } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { currencyCodes } from '../constants/currencyCodes';
const { Text, Link } = Typography;

type currency = string | undefined;

interface FormatNumberProps {
  value: number | string | undefined | null;
  maximumFractionDigits?: number;
}

interface FormatCurrencyProps extends FormatNumberProps {
  currency?: currency;
}

interface FormatCurrencyWithColorsProps extends FormatCurrencyProps {
  className?: string;
  addIcon?: boolean;
}

interface FormatPercentageWithColorsProps extends FormatNumberProps {
  className?: string;
  addIcon?: boolean;
}

function formatCurrency({
  value,
  maximumFractionDigits,
  currency,
}: FormatCurrencyProps) {
  if (currency === undefined || currency === '') {
    return formatNumber({ value, maximumFractionDigits });
  }
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  !value && (value = 0);

  if (
    !currencyCodes.find(
      (obj) => obj.value.toLowerCase() == currency.toLowerCase()
    )
  ) {
    return formatNumber({ value, maximumFractionDigits });
  }

  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: maximumFractionDigits,
  });
}

function getCurrencySymbol(currency: currency) {
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
  className = '',
  addIcon = false,
}: FormatCurrencyWithColorsProps) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  !value && (value = 0);

  if (currency === undefined) {
    var formattedValue = formatCurrency({ value, maximumFractionDigits });
  } else if (
    !currencyCodes.find(
      (obj) => obj.value.toLowerCase() == currency.toLowerCase()
    )
  ) {
    var formattedValue = formatNumber({ value, maximumFractionDigits });
  } else {
    var formattedValue = formatCurrency({
      value,
      maximumFractionDigits,
      currency,
    });
  }

  if (value > 0) {
    return (
      <Text className={className} type="success">
        {addIcon ? <RiseOutlined /> : undefined} {formattedValue}
      </Text>
    );
  }
  if (value < 0) {
    return (
      <Text className={className} type="danger">
        {addIcon ? <FallOutlined /> : undefined} {formattedValue}
      </Text>
    );
  }
  return <Text className={className}> formattedValue </Text>;
}

function formatPercentage({
  value,
  maximumFractionDigits = 2,
}: FormatNumberProps) {
  !value && (value = 0);

  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  return value.toLocaleString('nl-NL', {
    style: 'percent',
    minimumFractionDigits: maximumFractionDigits,
  });
}

function formatPercentageWithColors({
  value,
  maximumFractionDigits = 2,
  className = '',
  addIcon = false,
}: FormatPercentageWithColorsProps) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  !value && (value = 0);

  const formattedValue = formatPercentage({ value, maximumFractionDigits });

  if (value > 0) {
    return (
      <Text className={className} type="success">
        {addIcon ? <RiseOutlined /> : undefined} {formattedValue}
      </Text>
    );
  }
  if (value < 0) {
    return (
      <Text className={className} type="danger">
        {addIcon ? <FallOutlined /> : undefined} {formattedValue}
      </Text>
    );
  }
  return <Text className={className}>{formattedValue}</Text>;
}

function formatNumber({ value, maximumFractionDigits = 2 }: FormatNumberProps) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  !value && (value = 0);

  return value.toLocaleString('nl-NL', {
    maximumFractionDigits: maximumFractionDigits,
  });
}

function formatImageAndText(
  symbol: string,
  name: string,
  image: string | undefined
): JSX.Element {
  if (image === undefined) {
    image = '/images/fallback.png';
  }
  return (
    <div>
      <Link
        className="flex flex-col md:flex-row"
        href={`/authenticated/stock/?stock=${symbol}`}
      >
        <Image
          className="pr-1"
          alt="icon"
          src={image}
          width={35}
          height={35}
          preview={false}
          placeholder={false}
        />
        <div className="flex flex-col md:pl-1">
          <Text className="hidden md:inline " strong>
            {name}
          </Text>
          <Text type="secondary">{symbol}</Text>
        </div>
      </Link>
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
  getCurrencySymbol,
};
