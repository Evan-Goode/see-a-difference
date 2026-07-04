import styled from "styled-components";
import * as constants from "../constants";
import { transparentize, darken } from "polished";

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
	color: ${darken(0.2, constants.COLORS.a.treated)};
`;

export const Label = styled.label`
	color: ${(props) => props.color};
`;
