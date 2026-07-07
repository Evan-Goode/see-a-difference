import _ from "lodash";
import React, { useId, useState } from "react";

import * as constants from "../constants";
import { Row, Table } from "../components/common";

// Lanczos approximation of ln(Γ(x)).
const lgamma = x => {
	const g = 7;
	const c = [
		0.99999999999980993, 676.5203681218851, -1259.1392167224028,
		771.32342877765313, -176.61502916214059, 12.507343278686905,
		-0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
	];
	if (x < 0.5) {
		return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
	}
	x -= 1;
	const a = c[0];
	const t = x + g + 0.5;
	const sum = _.sum(c.slice(1).map((ci, i) => ci / (x + i + 1)));
	return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a + sum);
};

// Continued fraction for the incomplete beta function (Numerical Recipes).
const betacf = (a, b, x) => {
	const MAXIT = 300;
	const EPS = 3e-16;
	const FPMIN = 1e-300;
	const qab = a + b;
	const qap = a + 1;
	const qam = a - 1;
	let c = 1;
	let d = 1 - qab * x / qap;
	if (Math.abs(d) < FPMIN) d = FPMIN;
	d = 1 / d;
	let h = d;
	for (let m = 1; m <= MAXIT; m++) {
		const m2 = 2 * m;
		let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
		d = 1 + aa * d;
		if (Math.abs(d) < FPMIN) d = FPMIN;
		c = 1 + aa / c;
		if (Math.abs(c) < FPMIN) c = FPMIN;
		d = 1 / d;
		h *= d * c;
		aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
		d = 1 + aa * d;
		if (Math.abs(d) < FPMIN) d = FPMIN;
		c = 1 + aa / c;
		if (Math.abs(c) < FPMIN) c = FPMIN;
		d = 1 / d;
		const del = d * c;
		h *= del;
		if (Math.abs(del - 1) < EPS) break;
	}
	return h;
};

// Regularized incomplete beta I_x(a, b).
const betai = (a, b, x) => {
	if (x <= 0) return 0;
	if (x >= 1) return 1;
	const bt = Math.exp(
		lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x)
	);
	if (x < (a + 1) / (a + b + 2)) {
		return (bt * betacf(a, b, x)) / a;
	}
	return 1 - (bt * betacf(b, a, 1 - x)) / b;
};

// Upper-tail p-value for an F statistic with (df1, df2) degrees of freedom.
const pFromF = (f, df1, df2) => {
	if (!isFinite(f) || f <= 0) return 1;
	const x = df2 / (df1 * f + df2);
	return betai(df2 / 2, df1 / 2, x);
};

const computeAnova = controls => {
	// 2x2 layout: factor A = group (a, b), factor B = treatment (control, treated).
	// Cells are ordered [a control, a treated, b control, b treated].
	const cell = [
		controls.a.control,
		controls.a.treated,
		controls.b.control,
		controls.b.treated,
	];
	const ns = cell.map(c => c.n);
	const means = cell.map(c => c.mean);
	const sds = cell.map(c => c.sd);

	const N = _.sum(ns);
	const numCells = cell.length;

	// Within-cell (error) SS
	const ssErr = _.sum(cell.map((_, i) => (ns[i] - 1) * sds[i] * sds[i]));
	const dfError = N - numCells;
	const mse = ssErr / dfError;

	// N_h is the harmonic mean of all of the cell sizes multiplied by the number of cells.
	const N_h = (numCells ** 2) / _.sum(ns.map(n => 1 / n));

	// Unweighted (least-squares) marginal means.
	const meanGroupA = _.mean([controls.a.control.mean, controls.a.treated.mean]);
	const meanGroupB = _.mean([controls.b.control.mean, controls.b.treated.mean]);
	const meanControl = _.mean([controls.a.control.mean, controls.b.control.mean]);
	const meanTreated = _.mean([controls.a.treated.mean, controls.b.treated.mean]);

	// σ²(means): the biased variance (divisor = k, the number of means).
	const variance = xs => {
		const mean = _.sum(xs) / xs.length;
		return _.sum(xs.map(x => (x - mean) ** 2)) / xs.length;
	};

	// Sums of squares: SS = N_h · σ²(means) for the relevant set of means.
	const ssBetween = N_h * variance(means);
	const ssA = N_h * variance([meanGroupA, meanGroupB]);
	const ssB = N_h * variance([meanControl, meanTreated]);
	const ssAB = ssBetween - ssA - ssB;

	const total = ssBetween + ssErr;

	const term = (name, ss) => {
		const df = 1; // every effect has exactly one degree of freedom
		const ms = ss / df;
		const f = ms / mse;
		const p = pFromF(f, df, dfError);
		return { name, ss, df, ms, f, p };
	};

	return {
		terms: {
			ssA: term(`Sex (${constants.GROUP_NAMES.a} vs. ${constants.GROUP_NAMES.b})`, ssA),
			ssB: term("Treatment (control vs. treated)", ssB),
			ssAB: term("Sex × Treatment", ssAB),
		},
		error: { name: "Error", ss: ssErr, df: dfError, ms: mse, f: null, p: null },
		total: { name: "Total (corrected)", ss: total, df: N - 1, ms: null, f: null, p: null },
	};
};

const P = props => {
	if (props.p < 0.0001) return <math><mi>p</mi><mo>&lt;</mo><mn>0.001</mn></math>;
	return <math><mi>p</mi><mo>=</mo><mn>{props.p.toFixed(3)}</mn></math>;
}

const AnovaTable = ({ result }) => (
	<Table>
		<thead>
			<tr>
				<th>Source</th>
				<th>SS</th>
				<th>df</th>
				<th>MS</th>
				<th>F</th>
				<th>p</th>
			</tr>
		</thead>
		<tbody>
			{Object.values(result.terms).map(t => (
				<tr key={t.name}>
					<td>{t.name}</td>
					<td>{t.ss.toFixed(constants.DECIMAL_PRECISION)}</td>
					<td>{t.df}</td>
					<td>{t.ms.toFixed(constants.DECIMAL_PRECISION)}</td>
					<td>{t.f.toFixed(constants.DECIMAL_PRECISION)}</td>
					<td><P p={t.p} /></td>
				</tr>
			))}
			<tr>
				<td>{result.error.name}</td>
				<td>{result.error.ss.toFixed(constants.DECIMAL_PRECISION)}</td>
				<td>{result.error.df}</td>
				<td>{result.error.ms.toFixed(constants.DECIMAL_PRECISION)}</td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td>{result.total.name}</td>
				<td>{result.total.ss.toFixed(constants.DECIMAL_PRECISION)}</td>
				<td>{result.total.df}</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</Table>
);

const Anova = ({ controls }) => {
	const result = computeAnova(controls);

	const alpha = 0.05;

	const alphaMessage = <math><mi>α</mi><mo>=</mo><mn>{alpha}</mn></math>;

	return (
		<>
			{result.terms.ssAB.p < alpha ? (
				<p>Using {alphaMessage}, the sex-by-treatment effect is <strong>statistically significant</strong> (<P p={result.terms.ssAB.p} />). The result suggests that the effect of treatment depended on sex. The result suggests that the females and males responded differently to the treatment. A sex-dependent effect was detected in this dataset.</p>
			) : (
				<p>Using {alphaMessage}, the sex-by-treatment effect is <strong>not statistically significant</strong> (<P p={result.terms.ssAB.p} />). This result does <strong>not</strong> suggest that the effect of treatment depended on sex. The result does <strong>not</strong> suggest that the females and males responded differently to the treatment. A sex-dependent effect could not be detected in this dataset. Proceeding to post-hoc within-sex tests is not recommended.</p>
			)}
			<details>
				<summary>ANOVA details</summary>
				<Row>
					<AnovaTable result={result} />
				</Row>
			</details>
		</>
	);
};

export default props => {
	// const withinSubjectsId = useId();
	// const betweenSubjectsId = useId();
	//
	// const [design, setDesign] = useState(null);

	// return (
	// 	<div>
	// 		<form>
	// 			<fieldset>
	// 				<legend>Select an option to continue analysis</legend>
	// 				<div>
	// 					<input type="radio" id={withinSubjectsId} name="design" value="within-subjects" checked={design === "within-subjects"} onChange={() => setDesign("within-subjects")} />
	// 					<label htmlFor={withinSubjectsId}>My treatment effect is within-subjects (e.g. control males and treated males are the same animals or participants before and after a manipulation)</label>
	// 				</div>
	// 				<div>
	// 					<input type="radio" id={betweenSubjectsId} name="design" value="between-subjects" checked={design === "between-subjects"} onChange={() => setDesign("between-subjects")} />
	// 					<label htmlFor={betweenSubjectsId}>My treatment effect is between subjects (each of the four groups has unique animals or participants)</label>
	// 				</div>
	// 			</fieldset>
	// 		</form>
	// 		{design === "within-subjects" && (<p>The ANOVA cannot be calculated using this tool; raw data are needed so that each subject's control measure can be matched up with their treated measure.</p>)}
	// 		{design === "between-subjects" && <Anova controls={props.controls} />}
	// 	</div>
	// );
	return (
		<div>
			<p>This analysis assumes the treatment effect is between-subjects (each of the four groups has unique animals or participants). Results will not be valid for within-subjects designs (e.g. control males and treated males are the same animals or participants before and after a manipulation).</p>
			<Anova controls={props.controls} />
		</div>
	);
};
