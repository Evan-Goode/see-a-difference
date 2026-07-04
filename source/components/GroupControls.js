import React from "react";
import _ from "lodash";
import styled from "styled-components";

import { Input, Check, Label } from "./common";

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
	const meanId = _.uniqueId();
	return (
		<Tr>
			<Td>
				<Label htmlFor={meanId} color={props.labelColor}>{props.label} Mean</Label>
			</Td>
			<Td>
				<Input
					id={meanId}
					name={meanName}
					value={props.groupControls[meanName]}
					onChange={props.handleChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const SpreadControls = props => {
	if (props.controls["use-se"]) {
		const seName = `${props.sample}-se`;
		const nName = `${props.sample}-n`;
		const seId = _.uniqueId();
		const nId = _.uniqueId();
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
							value={props.groupControls[seName]}
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
							value={props.groupControls[nName]}
							onChange={props.handleChange}
							color={props.color}
						/>
					</Td>
				</Tr>
			</>
		);
	}
	const sdName = `${props.sample}-sd`;
	const sdId = _.uniqueId();
	return (
		<Tr>
			<Td>
				<Label htmlFor={sdId} color={props.labelColor}>{props.label} SD</Label>
			</Td>
			<Td>
				<Input
					id={sdId}
					name={sdName}
					value={props.groupControls[sdName]}
					onChange={props.handleUseSeChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const UseSeControl = props => {
	const useSeName = "use-se";
	const useSeId = _.uniqueId();
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
	handleChangeControls = event => this.props.setControls({"use-se": event.target.checked});
	handleChangeGroupControls = event => {
		this.props.setGroupControls(this.props.group,
			Object.assign({}, this.props.groupControls, {
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
							groupControls={this.props.groupControls}
							label={`Control ${this.props.groupName}`}
							sample="control"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.control}
							labelColor={this.props.colors.intersect}
						/>
						<SpreadControls
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Control ${this.props.groupName}`}
							sample="control"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.control}
							labelColor={this.props.colors.intersect}
						/>
						<MeanControl
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Treated ${this.props.groupName}`}
							sample="treated"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.treated}
							labelColor={this.props.colors.intersect}
						/>
						<SpreadControls
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Treated ${this.props.groupName}`}
							sample="treated"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.treated}
							labelColor={this.props.colors.intersect}
						/>
						<UseSeControl
							controls={this.props.controls}
							handleChange={this.handleChangeControls}
						/>
					</tbody>
				</table>
			</FieldSet>
		);
	}
}
