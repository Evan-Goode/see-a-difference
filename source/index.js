import React from "react";
import { createRoot } from "react-dom/client";

import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";

import Main from "./views/Main";

const GlobalStyle = createGlobalStyle`
	em {
		font-style: italic;
	}
`;

const root = createRoot(document.querySelector("#root"));
root.render(
	<>
		<Reset />
		<GlobalStyle />
		<Main />
	</>
);
