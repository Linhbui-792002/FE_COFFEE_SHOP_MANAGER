export const currencyFormatter = number => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    currencyDisplay: 'code'
  })

  return formatter.format(number)
}

export const convertDate = dateString => {
  const date = new Date(dateString)
  if (isNaN(date)) {
    return 'Updating'
  }
  return date.toLocaleDateString('en-GB') // dd/mm/yyyy
}

export const objectToUrlParams = obj => {
  const params = []
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ''
    ) {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    }
  }
  return params.join('&')
}
