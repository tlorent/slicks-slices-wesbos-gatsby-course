const formatter = Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
}).format;

export default function formatMoney(cents) {
  return formatter(cents / 100);
}
