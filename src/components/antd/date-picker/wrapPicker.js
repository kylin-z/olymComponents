import React from 'react';
import PropTypes from 'prop-types';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import classNames from 'classnames';
import { generateShowHourMinuteSecond } from '../time-picker';
import warning from '../_util/warning';
import { getComponentLocale } from '../_util/getLocale';
function getColumns({ showHour, showMinute, showSecond, use12Hours }) {
    let column = 0;
    if (showHour) {
        column += 1;
    }
    if (showMinute) {
        column += 1;
    }
    if (showSecond) {
        column += 1;
    }
    if (use12Hours) {
        column += 1;
    }
    return column;
}
export default function wrapPicker(Picker, defaultFormat) {
    return _a = class PickerWrapper extends React.Component {
            constructor() {
                super(...arguments);
                this.handleOpenChange = (open) => {
                    const { onOpenChange, toggleOpen } = this.props;
                    onOpenChange(open);
                    if (toggleOpen) {
                        warning(false, '`toggleOpen` is deprecated and will be removed in the future, ' +
                            'please use `onOpenChange` instead, see: https://u.ant.design/date-picker-on-open-change');
                        toggleOpen({ open });
                    }
                };
            }
            render() {
                const props = this.props;
                const { prefixCls, inputPrefixCls } = props;
                const pickerClass = classNames({
                    [`${prefixCls}-picker`]: true,
                });
                const pickerInputClass = classNames(`${prefixCls}-picker-input`, inputPrefixCls, {
                    [`${inputPrefixCls}-lg`]: props.size === 'large',
                    [`${inputPrefixCls}-sm`]: props.size === 'small',
                    [`${inputPrefixCls}-disabled`]: props.disabled,
                });
                const locale = getComponentLocale(props, this.context, 'DatePicker', () => require('./locale/zh_CN'));
                const timeFormat = (props.showTime && props.showTime.format) || 'HH:mm:ss';
                const rcTimePickerProps = Object.assign({}, generateShowHourMinuteSecond(timeFormat), { format: timeFormat, use12Hours: (props.showTime && props.showTime.use12Hours) });
                const columns = getColumns(rcTimePickerProps);
                const timePickerCls = `${prefixCls}-time-picker-column-${columns}`;
                const timePicker = props.showTime ? (React.createElement(TimePickerPanel, Object.assign({}, rcTimePickerProps, props.showTime, { prefixCls: `${prefixCls}-time-picker`, className: timePickerCls, placeholder: locale.timePickerLocale.placeholder, transitionName: "slide-up" }))) : null;
                return (React.createElement(Picker, Object.assign({}, props, { pickerClass: pickerClass, pickerInputClass: pickerInputClass, locale: locale, timePicker: timePicker, onOpenChange: this.handleOpenChange })));
            }
        },
        _a.contextTypes = {
            antLocale: PropTypes.object,
        },
        _a.defaultProps = {
            format: defaultFormat || 'YYYY-MM-DD',
            transitionName: 'slide-up',
            popupStyle: {},
            onChange() {
            },
            onOk() {
            },
            onOpenChange() {
            },
            locale: {},
            prefixCls: 'ant-calendar',
            inputPrefixCls: 'ant-input',
        },
        _a;
    var _a;
}
