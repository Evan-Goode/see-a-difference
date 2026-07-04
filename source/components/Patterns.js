import React from "react";
import styled from "styled-components";

import * as constants from "../constants";

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
				<Pattern id={props.patternIds.a.treated} width="1" height="1">
					<rect
						x="0"
						y="0"
						width="1"
						height="1"
						fill={props.colors.a.treated}
					/>
				</Pattern>
				<Pattern id={props.patternIds.a.control} width="1" height="1">
					<rect
						x="0"
						y="0"
						width="1"
						height="1"
						fill={props.colors.a.control}
					/>
				</Pattern>
				<Pattern id={props.patternIds.b.treated} width="1" height="1">
					<rect
						x="0"
						y="0"
						width="1"
						height="1"
						fill={props.colors.b.treated}
					/>
				</Pattern>
				<Pattern id={props.patternIds.b.control} width="1" height="1">
					<rect
						x="0"
						y="0"
						width="1"
						height="1"
						fill={props.colors.b.control}
					/>
				</Pattern>
				{constants.HATCH ? <>
					<Pattern
						id={props.patternIds.a.intersect}
						patternTransform="rotate(45 0 0)"
						width={hatchSize}
						height={hatchSize}
					>
						<rect
							x="0"
							y="0"
							width={hatchSize}
							height={hatchSize}
							fill={props.colors.a.treated}
						/>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2={hatchSize}
							style={{
								stroke: props.colors.a.control,
								strokeWidth: hatchSize,
							}}
						/>
					</Pattern>
					<Pattern
						id={props.patternIds.b.intersect}
						patternTransform="rotate(45 0 0)"
						width={hatchSize}
						height={hatchSize}
					>
						<rect
							x="0"
							y="0"
							width={hatchSize}
							height={hatchSize}
							fill={props.colors.b.treated}
						/>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2={hatchSize}
							style={{
								stroke: props.colors.b.control,
								strokeWidth: hatchSize,
							}}
						/>
					</Pattern>
				</> : <>
					<Pattern
						id={props.patternIds.a.intersect}
						width="1"
						height="1"
					>
						<rect
							x="0"
							y="0"
							width="1"
							height="1"
							fill={props.colors.a.intersect}
						/>
					</Pattern>
					<Pattern
						id={props.patternIds.b.intersect}
						width="1"
						height="1"
					>
						<rect
							x="0"
							y="0"
							width="1"
							height="1"
							fill={props.colors.b.intersect}
						/>
					</Pattern>
				</>}
			</defs>
		</HiddenSvg>
	);
};
