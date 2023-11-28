import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";
import { useStateProvider } from "../contexts/StateProvider";
import axios from "axios";
import { reducerCases } from "../contexts/constants";
const Spotify = () => {
	const [{ token }, dispatch] = useStateProvider();

	const bodyRef = useRef();
	// console.log(bodyRef);
	const [navBackground, setNavBackground] = useState(false);
	const [headerBackground, setHeaderBackground] = useState(false);
	const bodyScrolled = () => {
		// const scrollStep = bodyRef.current.scrollTop;
		bodyRef.current.scrollTop >= 30
			? setNavBackground(true)
			: setNavBackground(false);
		bodyRef.current.scrollTop >= 268
			? setHeaderBackground(true)
			: setHeaderBackground(false);
		// console.log(scrollStep);
	};

	useEffect(() => {
		const getUserInfo = async () => {
			const { data } = await axios.get("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: "Bearer " + token,
					"content-type": "application/json",
				},
			});
			const userInfo = {
				userId: data.id,
				userName: data.display_name,
			};
			dispatch({ type: reducerCases.SET_USER, userInfo });
		};
		getUserInfo();
	}, [token, dispatch]);
	return (
		<Container>
			<div className="spotify_body">
				<Sidebar />

				<div className="body" ref={bodyRef} onScroll={bodyScrolled}>
					<Navbar navBackground={navBackground} />
					<div className="body_contents">
						<Body headerBackground={headerBackground} />
					</div>
				</div>
			</div>
			<div className="Spotify_footer">
				<Footer />
			</div>
		</Container>
	);
};

const Container = styled.div`
	max-height: 100vh;
	max-width: 100vw;
	overflow: hidden;
	display: grid;
	grid-template-rows: 85vh 15vh;
	.spotify_body {
		display: grid;
		grid-template-columns: 25vh 200vh;
		height: 100%;
		width: 100%;
		background: linear-gradient(transparent, rgb(0, 0, 0, 1));
		background-color: rgb(32, 87, 100);
	}
	.body {
		height: 100%;
		width: 100%;
		overflow: auto;
		&::-webkit-scrollbar {
			width: 0.7rem;
			max-height: 2rem;
			&-thumb {
				background-color: rgba(255, 255, 255, 0.6);
			}
		}
	}
	.body_contents {
	}
`;
export default Spotify;
