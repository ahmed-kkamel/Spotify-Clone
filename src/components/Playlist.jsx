import React, { useEffect } from "react";
import { useStateProvider } from "./../contexts/StateProvider";
import { reducerCases } from "../contexts/constants";
import axios from "axios";
import styled from "styled-components";
const Playlist = () => {
	const [{ token, playlists }, dispatch] = useStateProvider();
	useEffect(() => {
		const getPlaylistData = async () => {
			const response = await axios.get(
				"https://api.spotify.com/v1/me/playlists",
				{
					headers: {
						Authorization: "Bearer " + token,
						"content-type": "application/json",
					},
				}
			);
			const { items } = response.data;
			const playlists = items.map(({ name, id }) => {
				return { name, id };
			});
			dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
		};
		getPlaylistData();
	}, [token, dispatch]);

	const changeCurrentPlaylist = (playlistId) => {
		dispatch({ type: reducerCases.SET_PLAYLIST_ID, playlistId });
	};

	return (
		<Container>
			<ul>
				{playlists.map(({ name, id }) => {
					return (
						<li key={id} onClick={() => changeCurrentPlaylist(id)}>
							{name}
						</li>
					);
				})}
			</ul>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	overflow: hidden;
	ul {
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		height: 100%;
		max-height: 50vh;
		overflow: auto;
		&::-webkit-scrollbar {
			width: 0.7rem;
			&-thumb {
				background-color: rgba(255, 255, 255, 0.6);
			}
		}
	}
	li {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: 0.3s ease-in-out;
		cursor: pointer;
		&:hover {
			color: white;
		}
	}
`;

export default Playlist;
