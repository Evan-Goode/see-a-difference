import React from "react";
import styled from "styled-components";
import _ from "lodash";
import toast from "react-hot-toast";
import * as d3 from "d3";

import { Row, Column, Flexed, Spacer, FinePrint, Link } from "../components/common";
import Controls from "../components/SexDifference/Controls";
import ColorControls from "../components/SexDifference/ColorControls";
import Patterns from "../components/SexDifference/Patterns";
import LargeChart from "../components/LargeChart";
import EffectSize from "../components/EffectSize";
import ExportCsv from "../components/ExportCsv";
import SmallChart from "../components/SmallChart";
import Comparator from "../components/Comparator";
import * as constants from "../constants";
import { generateData, parseFloatFallback, parseIntFallback, parseSd } from "../utilities";

const COLOR_SCHEMES = {
	"Red & Blue": {
		a: "#82ace5",
		b: "#af3742",
		intersect: "#9666b8",
	},
	"Pink & Blue": {
		a: "#94c9fd",
		b: "#fe91c9",
		intersect: "#8e8ce4",
	},
	"Brown & Yellow": {
		a: "#ffbf69",
		b: "#7c3626",
		intersect: "#be7b48",
	},
	"Poppy & Sunglow": {
		a: "#fdca40",
		b: "#df2935",
		intersect: "#ee7a3b",
	},
	"Teal & Pumpkin": {
		a: "#f5853f",
		b: "#368f8b",
		intersect: "#7c3626",
	},
	"Brown & Gray": {
		a: "#d3d2c7",
		b: "#4c2719",
		intersect: "#907d70",
	},
};
const DEFAULT_COLOR_SCHEME = "Red & Blue";

const INITIAL_CONTROLS = {
	["a-mean"]: 175,
	["b-mean"]: 162,
	["a-sd"]: 7.1,
	["b-sd"]: 6.5,
	["a-n"]: 100,
	["b-n"]: 100,
	["use-se"]: false,
};

const processControls = (controls) => {
	return {
		a: {
			mean: parseFloatFallback(controls["a-mean"], 0),
			sd: parseSd(
				controls["a-sd"],
				controls["a-se"],
				controls["a-n"],
				controls["use-se"]
			),
			n: parseIntFallback(controls["a-n"], 1, true),
		},
		b: {
			mean: parseFloatFallback(controls["b-mean"], 0),
			sd: parseSd(
				controls["b-sd"],
				controls["b-se"],
				controls["b-n"],
				controls["use-se"]
			),
			n: parseIntFallback(controls["b-n"], 1, true),
		},
	};
};

const validateControls = (processed) => {
	const validate = (mean, sd) => {
		return (
			mean === 0 ||
			sd === 0 ||
			Math.abs(Math.log10(Math.abs(mean)) - Math.log10(Math.abs(sd))) < 10
		);
	};
	return (
		validate(processed.a.mean, processed.a.sd) &&
		validate(processed.b.mean, processed.b.sd)
	);
};

export default class SexDifferenceTool extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			controls: {
				["a-mean"]: INITIAL_CONTROLS["a-mean"].toString(),
				["b-mean"]: INITIAL_CONTROLS["b-mean"].toString(),
				["a-sd"]: INITIAL_CONTROLS["a-sd"].toString(),
				["b-sd"]: INITIAL_CONTROLS["b-sd"].toString(),
				["a-se"]: (
					INITIAL_CONTROLS["a-sd"] /
					Math.sqrt(INITIAL_CONTROLS["a-n"])
				).toString(),
				["b-se"]: (
					INITIAL_CONTROLS["b-sd"] /
					Math.sqrt(INITIAL_CONTROLS["b-n"])
				).toString(),
				["a-n"]: INITIAL_CONTROLS["a-n"],
				["b-n"]: INITIAL_CONTROLS["b-n"],
				["use-se"]: INITIAL_CONTROLS["use-se"],
			},
			colors: COLOR_SCHEMES[DEFAULT_COLOR_SCHEME],
		};
		this.patternIds = {
			a: _.uniqueId(),
			b: _.uniqueId(),
			intersect: _.uniqueId(),
		};
		this.toastId = null;
		this.lastInvalid = null;
	}
	setControls = (controls) => {
		this.setState({ controls });
	};
	setColors = (colors) => {
		this.setState({ colors });
	};
	componentDidMount() {
		this.maybeNotify();
	}
	componentDidUpdate() {
		this.maybeNotify();
	}
	maybeNotify() {
		const controls = processControls(this.state.controls);
		const invalid = !validateControls(controls);
		if (invalid === this.lastInvalid) return;
		this.lastInvalid = invalid;
		if (invalid) {
			this.toastId = toast(
				"This tool may report inaccurate results when the mean and standard deviation differ by many orders of magnitude.",
				{ icon: null, duration: Infinity, style: { background: "#F5E273" } }
			);
		} else if (this.toastId != null) {
			toast.dismiss(this.toastId);
			this.toastId = null;
		}
	}
	render() {
		const controls = processControls(this.state.controls);
		const data = {
			a: generateData(controls.a.mean, controls.a.sd),
			b: generateData(controls.b.mean, controls.b.sd),
		};
		const minX = Math.min(d3.min(data.a, d => d.x), d3.min(data.b, d => d.x));
		const maxX = Math.max(d3.max(data.a, d => d.x), d3.max(data.b, d => d.x));
		return (
			<>
				<p>
					This tool allows you to see the effect size (<math><mi>d</mi></math>) and percent
					overlap for any comparison between males and females. Enter the mean
					and standard deviation below for each group. If you have the
					standard error instead of the standard deviation, check the box to
					enter it and the sample size (<math><mi>n</mi></math>).
				</p>
				<Spacer />
				<Patterns
					colors={this.state.colors}
					patternIds={this.patternIds}
				/>
				<Row>
					<Controls
						controls={this.state.controls}
						setControls={this.setControls}
						colors={this.state.colors}
						labels={constants.GROUP_NAMES}
					/>
					<Flexed>
						<LargeChart
							data={data}
							minX={minX}
							maxX={maxX}
							patternIds={this.patternIds}
						/>
					</Flexed>
					<div>
						<EffectSize samples={controls} />
						<ExportCsv data={{
							[constants.GROUP_NAMES.a]: data.a,
							[constants.GROUP_NAMES.b]: data.b,
						}} />
					</div>
				</Row>
				<Spacer />
				<Row spacing="4rem">
					<Column>
						<div>{constants.GROUP_NAMES.a}</div>
						<SmallChart
							sample={controls.a}
							other={controls.b}
							patternIds={{
								sample: this.patternIds.a,
								intersect: this.patternIds.intersect,
							}}
						/>
						<Comparator
							sample={controls.a}
							other={controls.b}
							labels={{ sample: constants.GROUP_NAMES.a.toLowerCase(), other: constants.GROUP_NAMES.b.toLowerCase() }}
						/>
					</Column>
					<Column>
						<div>{constants.GROUP_NAMES.b}</div>
						<SmallChart
							sample={controls.b}
							other={controls.a}
							patternIds={{
								sample: this.patternIds.b,
								intersect: this.patternIds.intersect,
							}}
						/>
						<Comparator
							sample={controls.b}
							other={controls.a}
							labels={{ sample: constants.GROUP_NAMES.b.toLowerCase(), other: constants.GROUP_NAMES.a.toLowerCase() }}
						/>
					</Column>
				</Row>
				<Row>
					<ColorControls
						colors={this.state.colors}
						setColors={this.setColors}
						schemes={COLOR_SCHEMES}
						defaultScheme={DEFAULT_COLOR_SCHEME}
					/>
				</Row>
				<Spacer />
				<FinePrint>
					This tool assumes both distributions are normal. Effect size is based on Cohen’s <math><mi>d</mi></math>. Overlap is based on Weitzman’s <math><mi>∆</mi></math>.
				</FinePrint>
				<FinePrint>
					If you use this tool to prepare a publication, please cite: Maney DL. 2016 Perils and pitfalls of reporting sex differences. Phil. Trans. R. Soc. B 371: 20150119. <Link href="https://dx.doi.org/10.1098/rstb.2015.0119">https://dx.doi.org/10.1098/rstb.2015.0119</Link>
				</FinePrint>
			</>
		);
	}
}
