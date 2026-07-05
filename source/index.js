import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";

import Main from "./views/Main";

const GlobalStyle = createGlobalStyle`
	em {
		font-style: italic;
	}
`;

const root = createRoot(document.querySelector("#root"));
root.render(
	<>
		<GlobalStyle />
		<Main />
	</>
);
