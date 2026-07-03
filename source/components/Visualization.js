import React from "react";
import styled from "styled-components";
import _ from "lodash";
import toast from "react-hot-toast";

import {Row, Column, Flexed, Spacer} from "../components/common";
import Controls from "../components/Controls";
import ColorControls from "../components/ColorControls";
import Patterns from "../components/Patterns";
import LargeChart from "../components/LargeChart";
import EffectSize from "../components/EffectSize";
import ExportCsv from "../components/ExportCsv";
import SmallChart from "../components/SmallChart";
import Comparator from "../components/Comparator";
import * as constants from "../constants";

const INITIAL_CONTROLS = {
	["a-mean"]: 175,
	["b-mean"]: 162,
	["a-sd"]: 7.1,
	["b-sd"]: 6.5,
	["a-n"]: 100,
	["b-n"]: 100,
	["use-se"]: false,
};

const parseFloatFallback = (value, fallback, positive = false) => {
	const parsed = parseFloat(value);
	return isNaN(parsed) || (positive && parsed <= 0) ? fallback : parsed;
};
const parseSd = (sd, se, n, useSe) => {
	if (useSe) {
		return (
			parseFloatFallback(se, 1, true) *
			Math.sqrt(parseFloatFallback(n, 1, true))
		);
	}
	return parseFloatFallback(sd, 1, true);
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
		},
		b: {
			mean: parseFloatFallback(controls["b-mean"], 0),
			sd: parseSd(
				controls["b-sd"],
				controls["b-se"],
				controls["b-n"],
				controls["use-se"]
			),
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

export default class Visualization extends React.PureComponent {
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
			colors: constants.COLORS,
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
		this.setState({controls});
	};
	setColors = (colors) => {
		this.setState({colors});
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
		const smallPatternIdsA = {
			sample: this.patternIds.a,
			intersect: this.patternIds.intersect,
		};
		const smallPatternIdsB = {
			sample: this.patternIds.b,
			intersect: this.patternIds.intersect,
		};
		return (
			<>
				<Patterns
					colors={this.state.colors}
					patternIds={this.patternIds}
				/>
				<Row>
					<Controls
						controls={this.state.controls}
						setControls={this.setControls}
						colors={this.state.colors}
					/>
					<Flexed>
						<LargeChart
							samples={controls}
							patternIds={this.patternIds}
						/>
					</Flexed>
					<div>
						<EffectSize samples={controls} />
						<ExportCsv samples={controls} />
					</div>
				</Row>
				<Spacer />
				<Row spacing="4rem">
					<Column>
						<p>Male</p>
						<SmallChart
							sample={controls.a}
							other={controls.b}
							patternIds={smallPatternIdsA}
						/>
						<Comparator
							sample={controls.a}
							other={controls.b}
							labels={{sample: "male", other: "female"}}
						/>
					</Column>
					<Column>
						<p>Female</p>
						<SmallChart
							sample={controls.b}
							other={controls.a}
							patternIds={smallPatternIdsB}
						/>
						<Comparator
							sample={controls.b}
							other={controls.a}
							labels={{sample: "female", other: "male"}}
						/>
					</Column>
				</Row>
				<Spacer />
				<Row>
					<ColorControls
						colors={this.state.colors}
						setColors={this.setColors}
					/>
				</Row>
			</>
		);
	}
}
