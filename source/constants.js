export const Z_MIN = -4;
export const Z_MAX = 4;

export const ANIMATION_DURATION = 500; // milliseconds
export const SAMPLE_COUNT = 64;
export const DECIMAL_PRECISION = 2;

export const CSV_FILENAME = "sexdifference.csv";

export const HATCH = false;

export const COLOR_SCHEMES = {
	"Red & Blue": {
		a: {
			control: "#A4DBE3",
			treated: "#2F79B2",
			intersect: "#173C58",
		},
		b: {
			control: "#F1CBC8",
			treated: "#BE4F66",
			intersect: "#5F2733",
		},
	},
	"Pink & Blue": {
		a: "#94c9fd",
		b: "#fe91c9",
		intersect: "#8e8ce4",
	},
	"Brown & Yellow": {
		a: "#ffbf69",
		b: "#7c3626",
		intersect: "#be7b48",
	},
	"Poppy & Sunglow": {
		a: "#fdca40",
		b: "#df2935",
		intersect: "#ee7a3b",
	},
	"Teal & Pumpkin": {
		a: "#f5853f",
		b: "#368f8b",
		intersect: "#7c3626",
	},
	"Brown & Gray": {
		a: "#d3d2c7",
		b: "#4c2719",
		intersect: "#907d70",
	},
};
export const DEFAULT_COLOR_SCHEME = "Red & Blue";

export const COLORS = COLOR_SCHEMES[DEFAULT_COLOR_SCHEME];

export const GROUP_NAMES = {
	a: "Male",
	b: "Female",
};
