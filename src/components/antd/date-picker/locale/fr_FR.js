import CalendarLocale from 'rc-calendar/lib/locale/fr_FR';
import TimePickerLocale from '../../time-picker/locale/fr_FR';
// Merge into a locale object
const locale = {
    lang: Object.assign({ placeholder: 'Sélectionner une date', rangePlaceholder: ['Date de début', 'Date de fin'] }, CalendarLocale),
    timePickerLocale: Object.assign({}, TimePickerLocale),
};
// All settings at:
// https://github.com/ant-design/ant-design/issues/424
export default locale;