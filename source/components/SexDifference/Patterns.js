import React from "react";
import styled from "styled-components";

import * as constants from "../../constants";

const HiddenSvg = styled.svg`
	width: 0;
	height: 0;
	position: absolute;
`;

const Pattern = (props) => {
	return (
		<pattern {...props} id={props.id} patternUnits="userSpaceOnUse">
			{props.children}
		</pattern>
	);
};

export default (props) => {
	const hatchSize = 8;
	return (
		<HiddenSvg>
			<defs>
				<Pattern id={props.patternIds.a} width="1" height="1">
					<rect
						x="0"
						y="0"
						width="1"
						height="1"
						fill={props.colors.a}
					/>
				</Pattern>
				<Pattern id={props.patternIds.b} width="1" height="1">
					<rect
						x="0"
						y="0"
						width="1"
						height="1"
						fill={props.colors.b}
					/>
				</Pattern>
				{constants.HATCH ? (
					<Pattern
						id={props.patternIds.intersect}
						patternTransform="rotate(45 0 0)"
						width={hatchSize}
						height={hatchSize}
					>
						<rect
							x="0"
							y="0"
							width={hatchSize}
							height={hatchSize}
							fill={props.colors.a}
						/>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2={hatchSize}
							style={{
								stroke: props.colors.b,
								strokeWidth: hatchSize,
							}}
						/>
					</Pattern>
				) : (
					<Pattern
						id={props.patternIds.intersect}
						width="1"
						height="1"
					>
						<rect
							x="0"
							y="0"
							width="1"
							height="1"
							fill={props.colors.intersect}
						/>
					</Pattern>
				)}
			</defs>
		</HiddenSvg>
	);
};
