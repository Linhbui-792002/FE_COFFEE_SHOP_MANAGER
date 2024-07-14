export const currencyFormatter = (number, currency = 'VND') => {
  if (currency === 'VND') {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code'
    })
    return formatter.format(number)
  }
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'decimal'
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

export const convertDateWithTime = dateString => {
  const date = new Date(dateString)
  if (isNaN(date)) {
    return 'Updating'
  }

  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  }

  return date.toLocaleDateString('en-GB', options)
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


export  const getUniqueMenuInfo = (menus) => {
  const uniqueMenuInfo = [{
    _id: "",
    name: "Get all"
  }];
  const seenMenuInfoIds = new Set();

  if (Array.isArray(menus)) {
    menus.forEach(menu => {
      const menuInfo = menu.menuInfoId;
      if (menuInfo && !seenMenuInfoIds.has(menuInfo._id)) {
        uniqueMenuInfo.push(menuInfo);
        seenMenuInfoIds.add(menuInfo._id);
      }
    });
  }

  return uniqueMenuInfo;
};

export const getUniqueProducts = (menus) => {
  const uniqueProducts = [];
  const seenProductIds = new Set();
  if (Array.isArray(menus)) {
  menus.forEach(menu => {
      menu.productId?.forEach(product => {
          if (product && !seenProductIds.has(product._id)) {
              uniqueProducts.push(product);
              seenProductIds.add(product._id);
          }
      });
  });
}

  return uniqueProducts;
};