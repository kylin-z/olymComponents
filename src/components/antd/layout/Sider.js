var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
    const matchMediaPolyfill = (mediaQuery) => {
        return {
            media: mediaQuery,
            matches: false,
            addListener() {
            },
            removeListener() {
            },
        };
    };
    window.matchMedia = window.matchMedia || matchMediaPolyfill;
}
import React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import PropTypes from 'prop-types';
import Icon from '../icon';
const dimensionMap = {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1600px',
};
export default class Sider extends React.Component {
    constructor(props) {
        super(props);
        this.responsiveHandler = (mql) => {
            this.setState({ below: mql.matches });
            if (this.state.collapsed !== mql.matches) {
                this.setCollapsed(mql.matches, 'responsive');
            }
        };
        this.setCollapsed = (collapsed, type) => {
            if (!('collapsed' in this.props)) {
                this.setState({
                    collapsed,
                });
            }
            const { onCollapse } = this.props;
            if (onCollapse) {
                onCollapse(collapsed, type);
            }
        };
        this.toggle = () => {
            const collapsed = !this.state.collapsed;
            this.setCollapsed(collapsed, 'clickTrigger');
        };
        this.belowShowChange = () => {
            this.setState({ belowShow: !this.state.belowShow });
        };
        let matchMedia;
        if (typeof window !== 'undefined') {
            matchMedia = window.matchMedia;
        }
        if (matchMedia && props.breakpoint && props.breakpoint in dimensionMap) {
            this.mql = matchMedia(`(max-width: ${dimensionMap[props.breakpoint]})`);
        }
        let collapsed;
        if ('collapsed' in props) {
            collapsed = props.collapsed;
        }
        else {
            collapsed = props.defaultCollapsed;
        }
        this.state = {
            collapsed,
            below: false,
        };
    }
    getChildContext() {
        return {
            siderCollapsed: this.state.collapsed,
        };
    }
    componentWillReceiveProps(nextProps) {
        if ('collapsed' in nextProps) {
            this.setState({
                collapsed: nextProps.collapsed,
            });
        }
    }
    componentDidMount() {
        if (this.mql) {
            this.mql.addListener(this.responsiveHandler);
            this.responsiveHandler(this.mql);
        }
    }
    componentWillUnmount() {
        if (this.mql) {
            this.mql.removeListener(this.responsiveHandler);
        }
    }
    render() {
        const _a = this.props, { prefixCls, className, collapsible, reverseArrow, trigger, style, width, collapsedWidth } = _a, others = __rest(_a, ["prefixCls", "className", "collapsible", "reverseArrow", "trigger", "style", "width", "collapsedWidth"]);
        const divProps = omit(others, ['collapsed',
            'defaultCollapsed', 'onCollapse', 'breakpoint']);
        const siderWidth = this.state.collapsed ? collapsedWidth : width;
        // special trigger when collapsedWidth == 0
        const zeroWidthTrigger = collapsedWidth === 0 || collapsedWidth === '0' ? (React.createElement("span", { onClick: this.toggle, className: `${prefixCls}-zero-width-trigger` },
            React.createElement(Icon, { type: "bars" }))) : null;
        const iconObj = {
            'expanded': reverseArrow ? React.createElement(Icon, { type: "right" }) : React.createElement(Icon, { type: "left" }),
            'collapsed': reverseArrow ? React.createElement(Icon, { type: "left" }) : React.createElement(Icon, { type: "right" }),
        };
        const status = this.state.collapsed ? 'collapsed' : 'expanded';
        const defaultTrigger = iconObj[status];
        const triggerDom = (trigger !== null ?
            zeroWidthTrigger || (React.createElement("div", { className: `${prefixCls}-trigger`, onClick: this.toggle, style: { width: siderWidth } }, trigger || defaultTrigger)) : null);
        const divStyle = Object.assign({}, style, { flex: `0 0 ${siderWidth}px`, maxWidth: `${siderWidth}px`, minWidth: `${siderWidth}px`, width: `${siderWidth}px` });
        const siderCls = classNames(className, prefixCls, {
            [`${prefixCls}-collapsed`]: !!this.state.collapsed,
            [`${prefixCls}-has-trigger`]: !!trigger,
            [`${prefixCls}-below`]: !!this.state.below,
            [`${prefixCls}-zero-width`]: siderWidth === 0 || siderWidth === '0',
        });
        return (React.createElement("div", Object.assign({ className: siderCls }, divProps, { style: divStyle }),
            React.createElement("div", { className: `${prefixCls}-children` }, this.props.children),
            collapsible || (this.state.below && zeroWidthTrigger) ? triggerDom : null));
    }
}
Sider.__ANT_LAYOUT_SIDER = true;
Sider.defaultProps = {
    prefixCls: 'ant-layout-sider',
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: 64,
    style: {},
};
Sider.childContextTypes = {
    siderCollapsed: PropTypes.bool,
};