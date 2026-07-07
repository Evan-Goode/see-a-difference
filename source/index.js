import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router";

import Main from "./views/Main";
import SexDifferencePage from "./views/SexDifferencePage";
import SexDependentEffectPage from "./views/SexDependentEffectPage";

const GlobalStyle = createGlobalStyle`
	em {
		font-style: italic;
	}
`;

const root = createRoot(document.querySelector("#root"));
root.render(
	<BrowserRouter>
		<GlobalStyle />
		<Routes>
			<Route element={<Main />}>
				<Route index element={<SexDifferencePage />} />
				<Route path="sex-dependent-effect" element={<SexDependentEffectPage />} />
			</Route>
		</Routes>
	</BrowserRouter>
);
