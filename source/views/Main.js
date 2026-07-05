import React from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import { lighten } from "polished";

import { Row, Spacer, Link } from "../components/common";
import Visualization from "../components/Visualization";

const color = lighten(1 / 5, "black");

const StyleWrapper = styled.div`
	font-family: Lato, sans-serif;
	color: ${color};
	line-height: 1.4;
	font-size: 1.2em;
	h1 {
		margin: 0;
	}
	h2 {
		margin: 0;
	}
`;
const Container = styled.div`
	margin: 3em auto;
	padding: 0 1em;
	width: 1024px;
`;
const H1 = styled.h1`
	font-size: 4em;
	font-weight: bold;
`;
const H2 = styled.h2`
	font-size: 1.5em;
	font-weight: bold;
`;
const Header = styled.div`
	text-align: center;
`;
const FinePrint = styled.p`
	color: ${lighten(1 / 4, color)};
`;

export default props => {
	return (
		<StyleWrapper>
			<Toaster />
			<Container>
				<div>
					<Header>
						<H1>SexDifference.org</H1>
						<H2>Interactive tools for visualizing sex-related variability</H2>
					</Header>
					<p>
						This tool allows you to see the effect size (<em>d</em>) and percent
						overlap for any comparison between males and females. Enter the mean
						and standard deviation below for each group. If you have the
						standard error instead of the standard deviation, check the box to
						enter it and the sample size (<em>n</em>).
					</p>
				</div>
				<Visualization />
				<FinePrint>
					This tool assumes all distributions are normal. Effect size is based
					on Cohen’s d. Overlap is based on Weitzman’s ∆. The <Link href="https://github.com/evan-goode/see-a-difference">source code</Link> is available under AGPLv3. If you use this tool to prepare a publication, please
					cite: Maney DL. 2016 Perils and pitfalls of reporting sex differences.
					Phil. Trans. R. Soc. B 371: 20150119.{" "}
					<Link href="https://dx.doi.org/10.1098/rstb.2015.0119">
						https://dx.doi.org/10.1098/rstb.2015.0119
					</Link>
				</FinePrint>
			</Container>
		</StyleWrapper>
	);
};
