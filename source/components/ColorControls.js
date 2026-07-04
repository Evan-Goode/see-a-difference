import React, {useEffect, useId} from "react";
import _ from "lodash";
import styled from "styled-components";

import {Input} from "./common";
import * as constants from "../constants";

const Tr = styled.tr`
	> td:first-child {
		text-align: right;
	}
	> td:last-child {
		text-align: left;
	}
`;

const Td = styled.td`
	padding: 0.5em;
`;

const ColorControl = (props) => {
	const id = useId();
	return (
		<Tr>
			<Td>
				<label htmlFor={id}>{props.label}</label>
			</Td>
			<Td>
				<Input
					id={id}
					name={props.name}
					value={props.value}
					onChange={props.handleChange}
					color={props.value}
					width="5em"
				/>
			</Td>
		</Tr>
	);
};

export default class extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { showCustom: false };
		this.selectId = _.uniqueId();
	}
	handleChange = (event) => {
		this.props.setColors(
			Object.assign({}, this.props.colors, {
				[event.target.name]: event.target.value,
			})
		);
	};
	setScheme = (event) => {
		if (event.target.value in constants.COLOR_SCHEMES) {
			this.props.setColors(
				constants.COLOR_SCHEMES[event.target.value]
			)
		}
		this.setState({showCustom: event.target.value == "custom"});
	};
	render() {
		return (
			<table>
				<tbody>
					<Tr>
						<Td>
							<label htmlFor={this.selectId}>Color Scheme</label>
						</Td>
						<Td>
							<select id={this.selectId} name={this.selectId} onChange={this.setScheme} defaultValue={constants.DEFAULT_COLOR_SCHEME}>
								{Object.keys(constants.COLOR_SCHEMES).map(name => (
									<option value={name} key={name}>{name}</option>
								))}
								<option value="custom" key="custom">Custom colors...</option>
							</select>
						</Td>
					</Tr>
					{this.state.showCustom && <>
					<ColorControl
						label="Sample 1 Color"
						name="a"
						value={this.props.colors.a}
						handleChange={this.handleChange}
					/>
					<ColorControl
						label="Sample 2 Color"
						name="b"
						value={this.props.colors.b}
						handleChange={this.handleChange}
					/>
					{constants.HATCH || (
						<ColorControl
							label="Overlap Color"
							name="intersect"
							value={this.props.colors.intersect}
							handleChange={this.handleChange}
						/>
					)}
					</>}
				</tbody>
			</table>
		);
	}
}
