import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FullCalendar from 'rc-calendar/lib/FullCalendar';
import { PREFIX_CLS } from './Constants';
import Header from './Header';
import { getComponentLocale, getLocaleCode } from '../_util/getLocale';
function noop() { return null; }
function zerofixed(v) {
    if (v < 10) {
        return `0${v}`;
    }
    return `${v}`;
}
export default class Calendar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.monthCellRender = (value) => {
            const { prefixCls, monthCellRender = noop } = this.props;
            return (React.createElement("div", { className: `${prefixCls}-month` },
                React.createElement("div", { className: `${prefixCls}-value` }, value.localeData().monthsShort(value)),
                React.createElement("div", { className: `${prefixCls}-content` }, monthCellRender(value))));
        };
        this.dateCellRender = (value) => {
            const { prefixCls, dateCellRender = noop } = this.props;
            return (React.createElement("div", { className: `${prefixCls}-date` },
                React.createElement("div", { className: `${prefixCls}-value` }, zerofixed(value.date())),
                React.createElement("div", { className: `${prefixCls}-content` }, dateCellRender(value))));
        };
        this.setValue = (value, way) => {
            if (!('value' in this.props)) {
                this.setState({ value });
            }
            if (way === 'select') {
                if (this.props.onSelect) {
                    this.props.onSelect(value);
                }
            }
            else if (way === 'changePanel') {
                this.onPanelChange(value, this.state.mode);
            }
        };
        this.setType = (type) => {
            const mode = (type === 'date') ? 'month' : 'year';
            if (this.state.mode !== mode) {
                this.setState({ mode });
                this.onPanelChange(this.state.value, mode);
            }
        };
        this.onHeaderValueChange = (value) => {
            this.setValue(value, 'changePanel');
        };
        this.onHeaderTypeChange = (type) => {
            this.setType(type);
        };
        this.onSelect = (value) => {
            this.setValue(value, 'select');
        };
        // Make sure that moment locale had be set correctly.
        getComponentLocale(props, context, 'Calendar', () => require('./locale/zh_CN'));
        const value = props.value || props.defaultValue || moment();
        if (!moment.isMoment(value)) {
            throw new Error('The value/defaultValue of Calendar must be a moment object after `antd@2.0`, ' +
                'see: https://u.ant.design/calendar-value');
        }
        this.state = {
            value,
            mode: props.mode,
        };
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });
        }
    }
    onPanelChange(value, mode) {
        const { onPanelChange } = this.props;
        if (onPanelChange) {
            onPanelChange(value, mode);
        }
    }
    render() {
        const { state, props, context } = this;
        const { value, mode } = state;
        const localeCode = getLocaleCode(context);
        if (value && localeCode) {
            value.locale(localeCode);
        }
        const { prefixCls, style, className, fullscreen, dateFullCellRender, monthFullCellRender } = props;
        const type = (mode === 'year') ? 'month' : 'date';
        const locale = getComponentLocale(props, context, 'Calendar', () => require('./locale/zh_CN'));
        let cls = className || '';
        if (fullscreen) {
            cls += (` ${prefixCls}-fullscreen`);
        }
        const monthCellRender = monthFullCellRender || this.monthCellRender;
        const dateCellRender = dateFullCellRender || this.dateCellRender;
        return (React.createElement("div", { className: cls, style: style },
            React.createElement(Header, { fullscreen: fullscreen, type: type, value: value, locale: locale.lang, prefixCls: prefixCls, onTypeChange: this.onHeaderTypeChange, onValueChange: this.onHeaderValueChange }),
            React.createElement(FullCalendar, Object.assign({}, props, { Select: noop, locale: locale.lang, type: type, prefixCls: prefixCls, showHeader: false, value: value, monthCellRender: monthCellRender, dateCellRender: dateCellRender, onSelect: this.onSelect }))));
    }
}
Calendar.defaultProps = {
    locale: {},
    fullscreen: true,
    prefixCls: PREFIX_CLS,
    mode: 'month',
    onSelect: noop,
    onPanelChange: noop,
};
Calendar.propTypes = {
    monthCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
    monthFullCellRender: PropTypes.func,
    dateFullCellRender: PropTypes.func,
    fullscreen: PropTypes.bool,
    locale: PropTypes.object,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onPanelChange: PropTypes.func,
    value: PropTypes.object,
    onSelect: PropTypes.func,
};
Calendar.contextTypes = {
    antLocale: PropTypes.object,
};
