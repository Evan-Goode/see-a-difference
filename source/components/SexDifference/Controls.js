import React, { useId } from "react";
import styled from "styled-components";

import { Input, Check, Label } from "../common";

const FieldSet = styled.fieldset`
	border: none;
`;

const Tr = styled.tr`
	> td:first-child {
		text-align: right;
	}
	> td:last-child {
		text-align: center;
	}
`;

const Td = styled.td`
	padding: 0.5em;
`;

const MeanControl = props => {
	const meanName = `${props.sample}-mean`;
	const meanId = useId();
	return (
		<Tr>
			<Td>
				<Label htmlFor={meanId} color={props.labelColor}>{props.label} Mean</Label>
			</Td>
			<Td>
				<Input
					id={meanId}
					name={meanName}
					value={props.controls[meanName]}
					onChange={props.handleChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const SpreadControls = props => {
	const seName = `${props.sample}-se`;
	const nName = `${props.sample}-n`;
	const seId = useId();
	const nId = useId();

	if (props.controls["use-se"]) {
		return (
			<>
				<Tr>
					<Td>
						<Label htmlFor={seId} color={props.labelColor}>{props.label} SEM</Label>
					</Td>
					<Td>
						<Input
							id={seId}
							name={seName}
							value={props.controls[seName]}
							onChange={props.handleChange}
							color={props.color}
						/>
					</Td>
				</Tr>
				<Tr>
					<Td>
						<Label htmlFor={nId} color={props.labelColor}>
							{props.label} <em>n</em>
						</Label>
					</Td>
					<Td>
						<Input
							id={nId}
							name={nName}
							value={props.controls[nName]}
							onChange={props.handleChange}
							color={props.color}
						/>
					</Td>
				</Tr>
			</>
		);
	}
	const sdName = `${props.sample}-sd`;
	const sdId = useId();
	return (
		<Tr>
			<Td>
				<Label htmlFor={sdId} color={props.labelColor}>{props.label} SD</Label>
			</Td>
			<Td>
				<Input
					id={sdId}
					name={sdName}
					value={props.controls[sdName]}
					onChange={props.handleChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const UseSeControl = props => {
	const useSeName = "use-se";
	const useSeId = useId();
	return (
		<Tr>
			<Td>
				<Label htmlFor={useSeId} color={props.labelColor}>Use Standard Error</Label>
			</Td>
			<Td>
				<Check
					id={useSeId}
					name={useSeName}
					checked={props.controls[useSeName]}
					onChange={props.handleChange}
				/>
			</Td>
		</Tr>
	);
};

export default class extends React.PureComponent {
	handleChange = event => {
		this.props.setControls(
			Object.assign({}, this.props.controls, {
				[event.target.name]:
					event.target.type === "checkbox"
						? event.target.checked
						: event.target.value
			})
		);
	};
	render() {
		return (
			<FieldSet>
				<table>
					<tbody>
						<MeanControl
							controls={this.props.controls}
							label={this.props.labels.a}
							sample="a"
							handleChange={this.handleChange}
							color={this.props.colors.a}
						/>
						<SpreadControls
							controls={this.props.controls}
							label={this.props.labels.a}
							sample="a"
							handleChange={this.handleChange}
							color={this.props.colors.a}
						/>
						<MeanControl
							controls={this.props.controls}
							label={this.props.labels.b}
							sample="b"
							handleChange={this.handleChange}
							color={this.props.colors.b}
						/>
						<SpreadControls
							controls={this.props.controls}
							label={this.props.labels.b}
							sample="b"
							handleChange={this.handleChange}
							color={this.props.colors.b}
						/>
						<UseSeControl
							controls={this.props.controls}
							handleChange={this.handleChange}
						/>
					</tbody>
				</table>
			</FieldSet>
		);
	}
}
