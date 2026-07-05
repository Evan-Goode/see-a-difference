import React from "react";
import styled from "styled-components";
import _ from "lodash";
import toast from "react-hot-toast";
import * as d3 from "d3";

import { Row, Column, Flexed, Spacer } from "../components/common";
import GroupControls from "../components/GroupControls";
import ColorControls from "../components/ColorControls";
import Patterns from "../components/Patterns";
import LargeChart from "../components/LargeChart";
import Analysis from "../components/Analysis";
import EffectSize from "../components/EffectSize";
import ExportCsv from "../components/ExportCsv";
import * as constants from "../constants";
import { generateData } from "../utilities";

const ChartGrid = styled.div`
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-rows: auto auto auto auto;
`;

const GroupLabel = styled.header`
	font-weight: bold;
	text-align: center;
	grid-column: 1 / -1;
	font-size: 2rem;
	color: ${props => props.color};
`;

const GroupAnalysis = styled.div`
	justify-self: start;
	align-self: center;
`;

const StyledLargeChart = styled(LargeChart)``;

const StyledGroupControls = styled(GroupControls)`
	justify-self: end;
`;

const INITIAL_CONTROLS = {
	a: {
		["treated-mean"]: 11.3,
		["control-mean"]: 10.1,
		["treated-sd"]: 1.91,
		["control-sd"]: 2.06,
		["treated-n"]: 100,
		["control-n"]: 100,
	},
	b: {
		["treated-mean"]: 10.75,
		["control-mean"]: 9.8,
		["treated-sd"]: 2,
		["control-sd"]: 2.25,
		["treated-n"]: 100,
		["control-n"]: 100,
	},
	["use-se"]: false,
};

const parseFloatFallback = (value, fallback, positive = false) => {
	const parsed = parseFloat(value);
	return isNaN(parsed) || (positive && parsed <= 0) ? fallback : parsed;
};

const parseIntFallback = (value, fallback, positive = false) => {
	const parsed = parseInt(value);
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
			treated: {
				mean: parseFloatFallback(controls.a["treated-mean"], 0),
				sd: parseSd(
					controls.a["treated-sd"],
					controls.a["treated-se"],
					controls.a["treated-n"],
					controls["use-se"]
				),
				n: parseIntFallback(controls.a["treated-n"], 1, true),
			},
			control: {
				mean: parseFloatFallback(controls.a["control-mean"], 0),
				sd: parseSd(
					controls.a["control-sd"],
					controls.a["control-se"],
					controls.a["control-n"],
					controls["use-se"]
				),
				n: parseIntFallback(controls.a["control-n"], 1, true),
			},
		},
		b: {
			treated: {
				mean: parseFloatFallback(controls.b["treated-mean"], 0),
				sd: parseSd(
					controls.b["treated-sd"],
					controls.b["treated-se"],
					controls.b["treated-n"],
					controls["use-se"]
				),
				n: parseIntFallback(controls.b["treated-n"], 1, true),
			},
			control: {
				mean: parseFloatFallback(controls.b["control-mean"], 0),
				sd: parseSd(
					controls.b["control-sd"],
					controls.b["control-se"],
					controls.b["control-n"],
					controls["use-se"]
				),
				n: parseIntFallback(controls.b["control-n"], 1, true),
			},
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
		validate(processed.a.treated.mean, processed.a.treated.sd) &&
		validate(processed.a.control.mean, processed.a.control.sd) &&
		validate(processed.b.treated.mean, processed.b.control.sd) &&
		validate(processed.b.control.mean, processed.b.control.sd)
	);
};

export default class Visualization extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			controls: {
				a: {
					["treated-mean"]: INITIAL_CONTROLS.a["treated-mean"].toString(),
					["control-mean"]: INITIAL_CONTROLS.a["control-mean"].toString(),
					["treated-sd"]: INITIAL_CONTROLS.a["treated-sd"].toString(),
					["control-sd"]: INITIAL_CONTROLS.a["control-sd"].toString(),
					["treated-se"]: (
						INITIAL_CONTROLS.a["treated-sd"] /
						Math.sqrt(INITIAL_CONTROLS.a["treated-n"])
					).toString(),
					["control-se"]: (
						INITIAL_CONTROLS.a["control-sd"] /
						Math.sqrt(INITIAL_CONTROLS.a["control-n"])
					).toString(),
					["treated-n"]: INITIAL_CONTROLS.a["treated-n"],
					["control-n"]: INITIAL_CONTROLS.a["control-n"],
				},
				b: {
					["treated-mean"]: INITIAL_CONTROLS.b["treated-mean"].toString(),
					["control-mean"]: INITIAL_CONTROLS.b["control-mean"].toString(),
					["treated-sd"]: INITIAL_CONTROLS.b["treated-sd"].toString(),
					["control-sd"]: INITIAL_CONTROLS.b["control-sd"].toString(),
					["treated-se"]: (
						INITIAL_CONTROLS.b["treated-sd"] /
						Math.sqrt(INITIAL_CONTROLS.b["treated-n"])
					).toString(),
					["control-se"]: (
						INITIAL_CONTROLS.b["control-sd"] /
						Math.sqrt(INITIAL_CONTROLS.b["control-n"])
					).toString(),
					["treated-n"]: INITIAL_CONTROLS.b["treated-n"],
					["control-n"]: INITIAL_CONTROLS.b["control-n"],
				},
				["use-se"]: INITIAL_CONTROLS["use-se"],
			},
			colors: constants.COLORS,
		};
		this.patternIds = {
			a: {
				treated: _.uniqueId(),
				control: _.uniqueId(),
				intersect: _.uniqueId(),
			},
			b: {
				treated: _.uniqueId(),
				control: _.uniqueId(),
				intersect: _.uniqueId(),
			},
		};
		this.toastId = null;
		this.lastInvalid = null;
	}
	setGroupControls = (group, groupControls) => {
		this.setState({ controls: Object.assign({}, this.state.controls, { [group]: groupControls }) });
	};
	setControls = (controls) => {
		this.setState({ controls: Object.assign({}, this.state.controls, controls) });
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
			a: {
				treated: generateData(controls.a.treated.mean, controls.a.treated.sd),
				control: generateData(controls.a.control.mean, controls.a.control.sd),
			},
			b: {
				treated: generateData(controls.b.treated.mean, controls.b.treated.sd),
				control: generateData(controls.b.control.mean, controls.b.control.sd),
			},
		};
		const minX = Math.min(
			d3.min(data.a.treated, d => d.x), d3.min(data.a.control, d => d.x),
			d3.min(data.b.treated, d => d.x), d3.min(data.b.control, d => d.x),
		);
		const maxX = Math.max(
			d3.max(data.a.treated, d => d.x), d3.max(data.a.control, d => d.x),
			d3.max(data.b.treated, d => d.x), d3.max(data.b.control, d => d.x),
		);
		return (
			<>
				<Patterns
					colors={this.state.colors}
					patternIds={this.patternIds}
				/>
				<ChartGrid>
					<GroupLabel color={this.state.colors.b.intersect}>{constants.GROUP_NAMES.b}</GroupLabel>
					<StyledGroupControls
						controls={this.state.controls}
						groupControls={this.state.controls.b}
						group={"b"}
						setControls={this.setControls}
						setGroupControls={this.setGroupControls}
						colors={this.state.colors.b}
					/>
					<StyledLargeChart
						data={data.b}
						minX={minX}
						maxX={maxX}
						patternIds={this.patternIds.b}
					/>
					<GroupAnalysis>
						<EffectSize samples={controls.b} />
					</GroupAnalysis>
					<GroupLabel color={this.state.colors.a.intersect}>{constants.GROUP_NAMES.a}</GroupLabel>
					<StyledGroupControls
						controls={this.state.controls}
						groupControls={this.state.controls.a}
						group={"a"}
						setControls={this.setControls}
						setGroupControls={this.setGroupControls}
						colors={this.state.colors.a}
					/>
					<StyledLargeChart
						data={data.a}
						minX={minX}
						maxX={maxX}
						patternIds={this.patternIds.a}
					/>
					<GroupAnalysis>
						<EffectSize samples={controls.a} />
					</GroupAnalysis>
				</ChartGrid>
				<Row>
					<ExportCsv data={data} />
				</Row>
				<Analysis controls={controls} />
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
