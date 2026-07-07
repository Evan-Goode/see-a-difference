import React, {useEffect} from "react";
import _ from "lodash";

import ColorControl, { Tr, Td } from "./ColorControl";
import * as constants from "../constants";

export default class extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { showCustom: false };
		this.selectId = _.uniqueId();
	}
	handleChange = (event) => {
		const [group, role] = event.target.name.split(".");
		this.props.setColors(
			Object.assign({}, this.props.colors, {
				[group]: Object.assign({}, this.props.colors[group], {
					[role]: event.target.value,
				}),
			})
		);
	};
	setScheme = (event) => {
		if (event.target.value in this.props.schemes) {
			this.props.setColors(
				this.props.schemes[event.target.value]
			);
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
						label="Male Control Color"
						name="a.control"
						value={this.props.colors.a.control}
						handleChange={this.handleChange}
					/>
					<ColorControl
						label="Male Treated Color"
						name="a.treated"
						value={this.props.colors.a.treated}
						handleChange={this.handleChange}
					/>
					<ColorControl
						label="Female Control Color"
						name="b.control"
						value={this.props.colors.b.control}
						handleChange={this.handleChange}
					/>
					<ColorControl
						label="Female Treated Color"
						name="b.treated"
						value={this.props.colors.b.treated}
						handleChange={this.handleChange}
					/>
					{constants.HATCH || (
						<>
						<ColorControl
							label="Male Overlap Color"
							name="a.intersect"
							value={this.props.colors.a.intersect}
							handleChange={this.handleChange}
						/>
						<ColorControl
							label="Female Overlap Color"
							name="b.intersect"
							value={this.props.colors.b.intersect}
							handleChange={this.handleChange}
						/>
						</>
					)}
					</>}
				</tbody>
			</table>
		);
	}
}
