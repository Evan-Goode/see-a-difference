import React from "react";
import _ from "lodash";
import gaussian from "gaussian";
import styled from "styled-components";

import * as constants from "./constants";

export const d3FillWithPattern = (root, clipIds, patternId, width, height) => {
	clipIds
		.reduce((current, clipId) => {
			return current.append("g").attr("clip-path", `url(#${clipId})`);
		}, root)
		.append("rect")
		.attr("x", "0")
		.attr("y", "0")
		.attr("width", width)
		.attr("height", height)
		.attr("fill", `url(#${patternId})`);
};

export const d3Wrap = (wrapped, style = "") => {
	const Styled = styled.div`
		${style}
	`;
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.element = React.createRef();
		}
		shouldComponentUpdate() {
			return false; // we'll render with D3, not react
		}
		componentDidMount() {
			this.chart = new wrapped(this.element.current, this.props);
		}
		componentWillReceiveProps(next) {
			this.chart && this.chart.update(next);
		}
		render() {
			return <Styled className={this.props.className} ref={this.element} />;
		}
	};
};
export const d3Animate = (element, animate) => {
	if (animate)
		return element.transition().duration(constants.ANIMATION_DURATION);
	return element;
};

export const generateData = (mean, sd) => {
	const normal = gaussian(mean, sd * sd);
	return _.range(
		constants.Z_MIN,
		constants.Z_MAX,
		(constants.Z_MAX - constants.Z_MIN) / constants.SAMPLE_COUNT
	).map(z => {
		const x = z * sd + mean;
		return {
			x,
			y: normal.pdf(x)
		};
	});
};

export const riemann = (f, start, end) => {
	const delta = (end - start) / constants.SAMPLE_COUNT;
	return _.sum(_.range(start, end, delta).map(x => f(x) * delta));
};

export const parseFloatFallback = (value, fallback, positive = false) => {
	const parsed = parseFloat(value);
	return isNaN(parsed) || (positive && parsed <= 0) ? fallback : parsed;
};

export const parseIntFallback = (value, fallback, positive = false) => {
	const parsed = parseInt(value);
	return isNaN(parsed) || (positive && parsed <= 0) ? fallback : parsed;
};

export const parseSd = (sd, se, n, useSe) => {
	if (useSe) {
		return (
			parseFloatFallback(se, 1, true) *
			Math.sqrt(parseIntFallback(n, 1, true))
		);
	}
	return parseFloatFallback(sd, 1, true);
};
