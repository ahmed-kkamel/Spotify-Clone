import React, { useEffect } from "react";
import styled from "styled-components";
import { useStateProvider } from "../contexts/StateProvider";
import axios from "axios";
import { reducerCases } from "../contexts/constants";
import { AiFillClockCircle } from "react-icons/ai";

const Body = ({ headerBackground }) => {
	const [{ token, playlistId, selectedPlaylist }, dispatch] =
		useStateProvider();
	console.log(selectedPlaylist);
	// console.log(playlistId);
	useEffect(() => {
		const getInitialPlaylist = async () => {
			const response = await axios.get(
				`https://api.spotify.com/v1/playlists/${playlistId}`,
				{
					headers: {
						Authorization: "Bearer " + token,
						"content-type": "application/json",
					},
				}
			);
			// console.log(response);
			const selectedPlaylist = {
				id: response.data.id,
				name: response.data.name,
				description: response.data.description.startsWith("<a")
					? ""
					: response.data.description,
				images: response.data.images[0].url,
				tracks: response.data.tracks.items.map(({ track }) => ({
					id: track.id,
					name: track.name,
					duration: track.duration_ms,
					album: track.album.name,
					contextUri: track.album.uri,
					track_number: track.track_number,
					image: track.album.images[2].url,
					artists: track.artists.map((artist) => artist.name),
				})),
			};
			dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
			// console.log(selectedPlaylist);
		};
		getInitialPlaylist();
	}, [token, playlistId, dispatch]);

	function formatMillisecondsToMinutesSeconds(milliseconds) {
		// Ensure the input is a positive number
		milliseconds = Math.abs(milliseconds);

		// Calculate minutes and seconds
		const minutes = Math.floor(milliseconds / 60000);
		const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

		// Use padStart to ensure that single-digit seconds are formatted as "01", "02", etc.
		const formattedSeconds = seconds.padStart(2, "0");

		return `${minutes}:${formattedSeconds}`;
	}
	const playTrack = async (
		id,
		name,
		artists,
		image,
		contextUri,
		track_number
	) => {
		const response = await axios.put(
			`https://api.spotify.com/v1/me/player/play`,
			{
				contextUri,
				offset: {
					position: track_number - 1,
				},
				position_ms: 0,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			}
		);
		// console.log("playing", response);
		if (response.status === 204) {
			const currentlyPlaying = {
				id,
				name,
				artists,
				image,
			};
			dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
			dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
		} else {
			dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
		}
	};
	// const playTrack = async (
	// 	id,
	// 	name,
	// 	artists,
	// 	image,
	// 	context_uri,
	// 	track_number
	// ) => {
	// 	const response = await axios.put(
	// 		`https://api.spotify.com/v1/me/player/play`,
	// 		{
	// 			context_uri,
	// 			offset: {
	// 				position: track_number - 1,
	// 			},
	// 			position_ms: 0,
	// 		},
	// 		{
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: "Bearer " + token,
	// 			},
	// 		}
	// 	);
	// 	if (response.status === 204) {
	// 		const currentlyPlaying = {
	// 			id,
	// 			name,
	// 			artists,
	// 			image,
	// 		};
	// 		dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
	// 		dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
	// 	} else {
	// 		dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
	// 	}
	// };
	return (
		<Container headerBackground={headerBackground}>
			{selectedPlaylist && (
				<>
					<div className="playlist">
						<div className="image">
							<img src={selectedPlaylist.images} alt="selectedPlaylist" />
						</div>
						<div className="details">
							<span className="type">Playlist</span>
							<h1 className="title">{selectedPlaylist.name}</h1>
							<p className="description">{selectedPlaylist.description}</p>
						</div>
					</div>
					<div className="list">
						<div className="header-row">
							<div className="col">
								<span>#</span>
							</div>
							<div className="col">
								<span>Title</span>
							</div>
							<div className="col">
								<span>Album</span>
							</div>
							<div className="col">
								<span>
									<AiFillClockCircle />
								</span>
							</div>
						</div>
						<div className="tracks">
							{selectedPlaylist.tracks.map(
								(
									{
										id,
										name,
										artists,
										image,
										duration,
										album,
										// expexted error
										contextUri,
										track_number,
									},
									index
								) => {
									return (
										<div
											className="row"
											key={id}
											onClick={() =>
												playTrack(
													id,
													name,
													artists,
													image,
													// expexted error
													contextUri,
													track_number
												)
											}
										>
											<div className="col">
												<span>{index + 1}</span>
											</div>
											<div className="col detail">
												<div className="image">
													<img src={image} alt="track" />
												</div>
												<div className="info">
													<span className="name">{name}</span>
													<span>{artists}</span>
												</div>
											</div>
											<div className="col">
												<span>{album}</span>
											</div>
											<div className="col">
												<span>
													{formatMillisecondsToMinutesSeconds(duration)}
												</span>
											</div>
										</div>
									);
								}
							)}
						</div>
					</div>
				</>
			)}
		</Container>
	);
};

const Container = styled.div`
	.playlist {
		display: flex;
		align-items: center;
		margin: 0 2rem;
		gap: 2rem;
		.image {
			img {
				height: 15rem;
				box-shadow: rgba(0, 0, 0, 0, 25) 0px 25px 50px -12px;
			}
		}
		.details {
			display: flex;
			flex-direction: column;
			/* gap: -5 rem; */
			color: #e0ebeb;
		}
		.title {
			color: white;
			font-size: 4rem;
		}
	}
	.list {
		.header-row {
			display: grid;
			grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
			color: #dddcdc;
			margin: 1rem 0 0 0;
			position: sticky;
			top: 15vh;
			padding: 1rem 3rem;
			transition: 0.3s ease-in-out;
			/* background-color: ${(headerBackground) =>
				headerBackground ? "#000000dc" : "none"}; */
			background-color: ${({ headerBackground }) =>
				headerBackground ? "#000000dc" : "none"};
		}
		.tracks {
			margin: 0 2rem;
			display: flex;
			flex-direction: column;
			margin-bottom: 5rem;

			.row {
				padding: 0.5rem 1rem;
				display: grid;
				grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
				&:hover {
					background-color: rgba(0, 0, 0, 0.7);
				}
			}
			.col {
				display: flex;
				align-items: center;
				color: #dddcdc;
				img {
					height: 40px;
					width: 40px;
				}
			}
			.detail {
				display: flex;
				gap: 1rem;
				.info {
					display: flex;
					flex-direction: column;
				}
			}
		}
	}
`;
export default Body;
