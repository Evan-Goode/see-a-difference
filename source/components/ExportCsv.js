import React from "react";
import * as constants from "../constants";
import { Link } from "./common";
import { generateData } from "../utilities";

const formatLine = (sample, { x, y }) => [sample, x, y].join(",");

export default props => {
	const csvLines = ["Distribution,x value,y value"]
		.concat(props.data.a.control.map(point =>
			formatLine(`${constants.GROUP_NAMES.a} Control`, point)
		))
		.concat(props.data.a.treated.map(point =>
			formatLine(`${constants.GROUP_NAMES.a} Treated`, point)
		))
		.concat(props.data.b.control.map(point =>
			formatLine(`${constants.GROUP_NAMES.b} Control`, point)
		))
		.concat(props.data.b.treated.map(point =>
			formatLine(`${constants.GROUP_NAMES.b} Treated`, point)
		));

	const csv = csvLines.join("\n");
	const href = `data:application/octet-stream,${encodeURIComponent(csv)}`;
	return (
		<p>
			<Link href={href} download={constants.CSV_FILENAME}>
				Export CSV
			</Link>
		</p>
	);
};
