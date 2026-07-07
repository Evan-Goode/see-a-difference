import React, { useId } from "react";
import styled from "styled-components";

import { Input } from "./common";

export const Tr = styled.tr`
	> td:first-child {
		text-align: right;
	}
	> td:last-child {
		text-align: left;
	}
`;

export const Td = styled.td`
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

export default ColorControl;
