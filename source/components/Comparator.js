import React from "react";
import gaussian from "gaussian";
import styled from "styled-components";

const P = styled.p`
	text-align: center;
`;

export default props => {
	const isGreater = props.sample.mean > props.other.mean;
	const comparisonWord = isGreater ? "below" : "above";
	const normal = gaussian(props.sample.mean, props.sample.sd * props.sample.sd);
	const cdf = normal.cdf(props.other.mean);
	const percentage = Math.round(100 * (isGreater ? cdf : 1 - cdf));
	return (
		<P>
			{percentage}% of the {props.labels.sample}s are more {props.labels.other}-like than the average {props.labels.other}
		</P>
	);
};
