import React from "react";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";
import { Outlet, NavLink } from "react-router";
import { lighten } from "polished";

import { FinePrint, Spacer, Link, color } from "../components/common";

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
	summary {
		cursor: pointer;
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
const Nav = styled.nav`
	display: flex;
	justify-content: center;
	gap: 0;
	margin-bottom: 1em;
	position: relative;
	overflow: hidden;
	a {
		position: relative;
		color: ${color};
		padding: 0.5em 1.5em;
		border: 0.1em solid transparent;
		border-bottom: none;
		border-radius: 0.3em 0.3em 0 0;
		&:hover:not(.active) {
			background: ${lighten(3 / 4, color)};
		}
		&.active {
			border-color: ${lighten(1 / 2, color)};
			font-weight: bold;
			&::before {
				content: "";
				position: absolute;
				bottom: 0;
				right: 100%;
				width: 1000vw;
				border-bottom: 0.1em solid ${lighten(1 / 2, color)};
				z-index: 1;
			}
			&::after {
				content: "";
				position: absolute;
				bottom: 0;
				left: 100%;
				width: 1000vw;
				border-bottom: 0.1em solid ${lighten(1 / 2, color)};
				z-index: 1;
			}
		}
	}
`;

export default props => {
	return (
		<StyleWrapper>
			<Toaster />
			<Container>
				<Header>
					<H1>SexDifference.org</H1>
					<H2>Interactive tools for visualizing sex-related variability</H2>
				</Header>
				<Spacer />
				<Nav>
					<NavLink to="/" end>Sex Difference</NavLink>
					<NavLink to="/sex-dependent-effect">Sex-Dependent Effect</NavLink>
				</Nav>
				<Outlet />
				<FinePrint>
					Created by Evan Goode and Donna L. Maney. <Link href="https://github.com/evan-goode/see-a-difference">Source code</Link> is available under AGPLv3.
				</FinePrint>
			</Container>
		</StyleWrapper>
	);
};
