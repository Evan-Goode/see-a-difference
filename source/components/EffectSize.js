import React from "react";
import gaussian from "gaussian";

import * as constants from "../constants";
import { riemann } from "../utilities";

const describeCohen = d => {
	if (d < 0.2) return "trivial";
	if (d < 0.5) return "small";
	if (d < 0.8) return "medium";
	return "large";
};

export default props => {
	const { treated, control } = props.samples;
	const cohen = Math.abs(
		(treated.mean - control.mean) / Math.sqrt((treated.sd * treated.sd + control.sd * control.sd) / 2)
	);
	const minimum = Math.min(
		constants.Z_MIN * treated.sd + treated.mean,
		constants.Z_MIN * control.sd + control.mean
	);
	const maximum = Math.max(
		constants.Z_MAX * treated.sd + treated.mean,
		constants.Z_MAX * control.sd + control.mean
	);
	const distributions = {
		treated: gaussian(treated.mean, treated.sd * treated.sd),
		control: gaussian(control.mean, control.sd * control.sd)
	};
	const overlap = riemann(
		x => Math.min(distributions.treated.pdf(x), distributions.control.pdf(x)),
		minimum,
		maximum
	);
	const percentage = `${Math.round(100 * overlap)}%`;
	return (
		<>
			<p>
				<em>d</em> = {cohen.toFixed(constants.DECIMAL_PRECISION)} (
				{describeCohen(cohen)})
			</p>
			<p>overlap = {percentage}</p>
		</>
	);
};
