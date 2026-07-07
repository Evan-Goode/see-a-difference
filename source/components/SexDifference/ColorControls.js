import React from "react";
import _ from "lodash";

import ColorControl, { Tr, Td } from "../ColorControl";
import * as constants from "../../constants";

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
		if (event.target.value in this.props.schemes) {
			this.props.setColors(
				this.props.schemes[event.target.value]
			);
		}
		this.setState({ showCustom: event.target.value == "custom" });
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
							<select id={this.selectId} name={this.selectId} onChange={this.setScheme} defaultValue={this.props.defaultScheme}>
								{Object.keys(this.props.schemes).map(name => (
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
