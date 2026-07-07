import React from "react";
import styled from "styled-components";
import _ from "lodash";
import toast from "react-hot-toast";
import * as d3 from "d3";

import { Row, Spacer, FinePrint } from "../components/common";
import GroupControls from "../components/SexDependentEffect/GroupControls";
import ColorControls from "../components/ColorControls";
import Patterns from "../components/Patterns";
import LargeChart from "../components/LargeChart";
import AnovaAnalysis from "../components/AnovaAnalysis";
import EffectSize from "../components/EffectSize";
import ExportCsv from "../components/ExportCsv";
import * as constants from "../constants";
import { generateData, parseFloatFallback, parseIntFallback, parseSd } from "../utilities";

const ChartGrid = styled.div`
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-rows: auto auto auto auto;
`;

const GroupLabel = styled.header`
	text-align: center;
	// grid-column: 1 / -1;
	font-size: 1.5rem;
	color: ${props => props.color};
`;

const GroupAnalysis = styled.div`
	justify-self: start;
	align-self: center;
`;

const ChartContainer = styled.div`
	align-self: center;
`;

const StyledGroupControls = styled(GroupControls)`
	font-size: 0.9em;
	justify-self: end;
`;

const COLOR_SCHEMES = {
	"Red & Blue": {
		a: {
			control: "#A4DBE3",
			treated: "#2F79B2",
			intersect: "#173C58",
		},
		b: {
			control: "#F1CBC8",
			treated: "#BE4F66",
			intersect: "#5F2733",
		},
	},
};
const DEFAULT_COLOR_SCHEME = "Red & Blue";

const INITIAL_CONTROLS = {
	a: {
		["treated-mean"]: 11.3,
		["control-mean"]: 10.1,
		["treated-sd"]: 1.91,
		["control-sd"]: 2.06,
		["treated-n"]: "",
		["control-n"]: "",
	},
	b: {
		["treated-mean"]: 10.75,
		["control-mean"]: 9.8,
		["treated-sd"]: 2,
		["control-sd"]: 2.25,
		["treated-n"]: "",
		["control-n"]: "",
	},
	["use-se"]: false,
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
				n: parseIntFallback(controls.a["treated-n"], null, true),
			},
			control: {
				mean: parseFloatFallback(controls.a["control-mean"], 0),
				sd: parseSd(
					controls.a["control-sd"],
					controls.a["control-se"],
					controls.a["control-n"],
					controls["use-se"]
				),
				n: parseIntFallback(controls.a["control-n"], null, true),
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
				n: parseIntFallback(controls.b["treated-n"], null, true),
			},
			control: {
				mean: parseFloatFallback(controls.b["control-mean"], 0),
				sd: parseSd(
					controls.b["control-sd"],
					controls.b["control-se"],
					controls.b["control-n"],
					controls["use-se"]
				),
				n: parseIntFallback(controls.b["control-n"], null, true),
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

export default class SexDependentEffectTool extends React.PureComponent {
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
			colors: COLOR_SCHEMES[DEFAULT_COLOR_SCHEME],
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
				<p>
					This tool depicts the effect size and percent overlap for within-sex effects of a manipulation or other within-sex factor. If the study design is between-subjects (each of the four groups has unique animals or participants), the tool under the graphs can compare the treatment effect between the sexes by comparing them statistically.
				</p>
				<p>
					Enter the mean, standard deviation, and sample size (<math><mi>n</mi></math>) below for each group. If you have the standard error instead of the standard deviation, check the &ldquo;Use Standard Error&rdquo; box.
				</p>
				<Spacer />
				<Patterns
					colors={this.state.colors}
					patternIds={this.patternIds}
				/>
				<ChartGrid>
					<StyledGroupControls
						controls={this.state.controls}
						groupControls={this.state.controls.b}
						group={"b"}
						setControls={this.setControls}
						setGroupControls={this.setGroupControls}
						colors={this.state.colors.b}
					/>
					<ChartContainer>
						<GroupLabel color={this.state.colors.b.intersect}>{constants.GROUP_NAMES.b}</GroupLabel>
						<LargeChart
							data={{ a: data.b.treated, b: data.b.control }}
							minX={minX}
							maxX={maxX}
							patternIds={{ a: this.patternIds.b.treated, b: this.patternIds.b.control, intersect: this.patternIds.b.intersect }}
						/>
					</ChartContainer>
					<GroupAnalysis>
						<EffectSize samples={{ a: controls.b.treated, b: controls.b.control }} />
					</GroupAnalysis>
					<StyledGroupControls
						controls={this.state.controls}
						groupControls={this.state.controls.a}
						group={"a"}
						setControls={this.setControls}
						setGroupControls={this.setGroupControls}
						colors={this.state.colors.a}
					/>
					<ChartContainer>
						<GroupLabel color={this.state.colors.a.intersect}>{constants.GROUP_NAMES.a}</GroupLabel>
						<LargeChart
							data={{ a: data.a.treated, b: data.a.control }}
							minX={minX}
							maxX={maxX}
							patternIds={{ a: this.patternIds.a.treated, b: this.patternIds.a.control, intersect: this.patternIds.a.intersect }}
						/>
					</ChartContainer>
					<GroupAnalysis>
						<EffectSize samples={{ a: controls.a.treated, b: controls.a.control }} />
					</GroupAnalysis>
				</ChartGrid>
				<Row>
					<ExportCsv data={{
						[`${constants.GROUP_NAMES.a} Control`]: data.a.control,
						[`${constants.GROUP_NAMES.a} Treated`]: data.a.treated,
						[`${constants.GROUP_NAMES.b} Control`]: data.b.control,
						[`${constants.GROUP_NAMES.b} Treated`]: data.b.treated,
					}} label="Export CSV used to make graphs" />
				</Row>
				<h3>Is this a sex-dependent effect?</h3>
				<AnovaAnalysis controls={controls} />
				{/*
				<Row>
					<ColorControls
						colors={this.state.colors}
						setColors={this.setColors}
						schemes={COLOR_SCHEMES}
						defaultScheme={DEFAULT_COLOR_SCHEME}
					/>
				</Row>*/}
				<Spacer />
				<FinePrint>
					This tool assumes all four underlying populations are normal with equal variance. Effect size is based on Cohen’s <math><mi>d</mi></math>. Overlap is based on Weitzman’s <math><mi>∆</mi></math>. The ANOVA analysis assumes the study design is between-subjects (each of the four groups has unique animals or participants). Results will not be valid for within-subjects designs (e.g. control males and treated males are the same animals or participants before and after a manipulation).
				</FinePrint>
			</>
		);
	}
}
