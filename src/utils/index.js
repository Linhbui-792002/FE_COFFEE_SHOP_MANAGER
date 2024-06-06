export const currencyFormatter = (number) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    currencyDisplay: 'code',
  });

  return formatter.format(number);
};

export const convertDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return 'Updating'
  }
  return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
}