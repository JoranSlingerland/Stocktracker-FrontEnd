// utils\formatting.js

function formatCurrency(value, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: maximumFractionDigits,
  });
}

function formatPercentage(value, maximumFractionDigits = 2) {
  return value.toLocaleString('nl-NL', {
    style: 'percent',
    minimumFractionDigits: maximumFractionDigits,
  });
}

export { formatCurrency, formatPercentage };
