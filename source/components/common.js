import styled from "styled-components";
import * as constants from "../constants";
import { transparentize, lighten, darken, cssVar } from "polished";

export const color = lighten(1 / 5, "black");

export const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	> :not(:first-child) {
		margin-left: ${(props) => props.spacing};
	}
	> :not(:last-child) {
		margin-right: ${(props) => props.spacing};
	}
`;

export const FinePrint = styled.p`
	color: ${lighten(1 / 4, color)};
`;

export const Column = styled(Row)`
	flex-direction: column;
`;
export const Flexed = styled.div`
	flex: 1;
`;
export const Spacer = styled.div`
	height: 3rem;
`;
export const Input = styled.input`
	font-size: inherit;
	font-family: inherit;
	font-weight: bold;
	border: none;
	outline: none;
	border-radius: 0.5em;
	width: ${(props) => props.width || "3em"};
	padding: 0.2em;
	text-align: center;
	transition: background ${constants.ANIMATION_DURATION}ms;
	border: 0.15em solid ${(props) => props.color};
	&:focus {
		background: ${(props) => false && transparentize(0.75, props.color)};
	}
`;
export const Check = styled.input.attrs({ type: "checkbox" })`
	width: 1.5em;
	height: 1.5em;
	vertical-align: middle;
`;
export const Link = styled.a`
	color: ${darken(0.2, "#2F79B2")};
`;

export const Label = styled.label`
	color: ${(props) => props.color};
`;

export const Table = styled.table`
	border-collapse: collapse;
	margin: 1em 0;
	th, td {
		padding: 0.4em 0.8em;
		border: 1px solid #ccc;
		text-align: right;
	}
	th:first-child, td:first-child {
		text-align: left;
	}
	tbody tr:last-child {
		font-weight: bold;
		background: #f4f4f4;
	}
`;
