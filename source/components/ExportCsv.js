import React from "react";
import * as constants from "../constants";
import { Link } from "./common";

const formatLine = (sample, { x, y }) => [sample, x, y].join(",");

export default props => {
	const csvLines = ["Distribution,x value,y value"]
		.concat(...Object.entries(props.data).map(([name, points]) =>
			points.map(point => formatLine(name, point))
		));

	const csv = csvLines.join("\n");
	const href = `data:application/octet-stream,${encodeURIComponent(csv)}`;
	return (
		<p>
			<Link href={href} download={constants.CSV_FILENAME}>
				{props.label || "Export CSV"}
			</Link>
		</p>
	);
};
