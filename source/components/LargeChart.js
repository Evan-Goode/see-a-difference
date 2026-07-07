import React from "react";
import * as d3 from "d3";
import _ from "lodash";

import {
	d3FillWithPattern,
	d3Wrap,
	d3Animate,
} from "../utilities";

const WIDTH = 320;
const HEIGHT = 180;
const MARGIN = {
	top: 0,
	right: 0,
	bottom: 18,
	left: 0
};

const style = `
	width: 100%;
	padding: 1em;
	box-sizing: border-box;
	svg {
		overflow: visible;
	}
`;

class LargeChart {
	constructor(element, { data, minX, maxX, patternIds }) {
		this.x = d3.scaleLinear();
		this.y = d3.scaleLinear();
		this.line = d3
			.line()
			.x(d => this.x(d.x))
			.y(d => this.y(d.y))
			.curve(d3.curveCardinal);
		this.root = d3
			.select(element)
			.append("svg")
			.attr(
				"viewBox",
				`${-1 * MARGIN.left} ${-1 * MARGIN.top} ${WIDTH +
					MARGIN.left +
					MARGIN.right} ${HEIGHT + MARGIN.top + MARGIN.bottom}`
			);
		this.axisX = this.root
			.append("g")
			.attr("transform", `translate(0 ${HEIGHT})`)
			.attr("class", "axis");
		const defs = this.root.append("defs");
		const clipIds = {
			a: _.uniqueId(),
			b: _.uniqueId(),
			intersect: _.uniqueId()
		};
		this.pathA = defs
			.append("clipPath")
			.attr("id", clipIds.a)
			.append("path");
		this.pathB = defs
			.append("clipPath")
			.attr("id", clipIds.b)
			.append("path");
		defs.append("clipPath");
		d3FillWithPattern(this.root, [clipIds.a], patternIds.a, WIDTH, HEIGHT);
		d3FillWithPattern(this.root, [clipIds.b], patternIds.b, WIDTH, HEIGHT);
		d3FillWithPattern(
			this.root,
			[clipIds.a, clipIds.b],
			patternIds.intersect,
			WIDTH,
			HEIGHT
		);
		this.update({ data, minX, maxX }, false);
	}
	update = ({ data, minX, maxX }, animate = true) => {
		const maxY = Math.max(d3.max(data.a, d => d.y), d3.max(data.b, d => d.y));
		this.x.domain([minX, maxX]).range([0, WIDTH]);
		this.y.domain([0, maxY]).range([HEIGHT, 0]);
		d3Animate(this.pathA, animate).attr("d", this.line(data.a));
		d3Animate(this.pathB, animate).attr("d", this.line(data.b));
		d3Animate(this.axisX, animate).call(
			d3.axisBottom(this.x).ticks(3)
		);
	};
}

export default d3Wrap(LargeChart, style);
