import React, { useId } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Input, Check, Label } from "../common";
import * as constants from "../../constants";

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
					value={props.groupControls[meanName]}
					onChange={props.handleChange}
					color={props.color}
				/>
			</Td>
		</Tr>
	);
};

const SpreadControls = props => {
	const sdName = `${props.sample}-sd`;
	const seName = `${props.sample}-se`;
	const nName = `${props.sample}-n`;
	const sdId = useId();
	const seId = useId();
	const nId = useId();

	return (
		<>
			{props.controls["use-se"] ? (
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
				</Tr>) : (

				<Tr>
					<Td>
						<Label htmlFor={sdId} color={props.labelColor}>{props.label} SD</Label>
					</Td>
					<Td>
						<Input
							id={sdId}
							name={sdName}
							value={props.groupControls[sdName]}
							onChange={props.handleChange}
							color={props.color}
						/>
					</Td>
				</Tr>
			)}
			<Tr>
				<Td>
					<Label htmlFor={nId} color={props.labelColor}>
						{props.label} <math><mi>n</mi></math>
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
			</Tr >
		</>
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
	handleChangeControls = event => {
		this.props.setControls({
			[event.target.name]:
				event.target.type === "checkbox"
					? event.target.checked
					: event.target.value
		});
	}
	handleChangeGroupControls = event => {
		this.props.setGroupControls(this.props.group, Object.assign({}, this.props.groupControls, {
			[event.target.name]:
				event.target.type === "checkbox"
					? event.target.checked
					: event.target.value
		}));
	};
	render() {
		const groupName = constants.GROUP_NAMES[this.props.group];
		return (
			<FieldSet className={this.props.className}>
				<table>
					<tbody>
						<MeanControl
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Control ${groupName}`}
							sample="control"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.control}
							labelColor={this.props.colors.intersect}
						/>
						<SpreadControls
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Control ${groupName}`}
							sample="control"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.control}
							labelColor={this.props.colors.intersect}
						/>
						<MeanControl
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Treated ${groupName}`}
							sample="treated"
							handleChange={this.handleChangeGroupControls}
							color={this.props.colors.treated}
							labelColor={this.props.colors.intersect}
						/>
						<SpreadControls
							controls={this.props.controls}
							groupControls={this.props.groupControls}
							label={`Treated ${groupName}`}
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
