import React, { useEffect } from "react";

import Login from "./components/Login";
import { useStateProvider } from "./contexts/StateProvider";
import { reducerCases } from "./contexts/constants";
import Spotify from "./components/Spotify";

function App() {
	const [{ token }, dispatch] = useStateProvider();
	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const token = hash.substring(1).split("&")[0].split("=")[1];
			dispatch({ type: reducerCases.SET_TOKEN, token });
		}
	}, [token, dispatch]);
	return <div>{token ? <Spotify /> : <Login />}</div>;
}

export default App;
