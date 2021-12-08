

const numberFormat = (value) =>
    new Intl.NumberFormat('en-vi', {
    style: 'decimal',
    currency: 'INR'
    }).format(value);

export {numberFormat};