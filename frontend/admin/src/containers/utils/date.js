import moment from 'moment';

const DEFAULT_DATE_FORMAT = 'DD/MM/yyyy'; // ex: 17/04/2020
const DEFAULT_TIME_FORMAT = 'HH:mm:ss'; // ex: 03:17
const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;

const toDateTimeString = (val) => {
    const date = moment(val);
  
    if (!date.isValid()) return '';
  
    return date.format(DEFAULT_DATE_TIME_FORMAT);
};

const toDateTString = (val) => {
    const date = moment(val);
  
    if (!date.isValid()) return '';
  
    return date.format(`${DEFAULT_DATE_FORMAT} HH:mm`);
};

const toTimeString = (val) =>{
    const date = moment(val);
    if (!date.isValid()) return '';
    return date.format('HH:mm');
}

export {toDateTimeString, toTimeString, toDateTString};