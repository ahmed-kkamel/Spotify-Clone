import React, { useEffect } from "react";
import { useStateProvider } from "../contexts/StateProvider";
import { reducerCases } from "../contexts/constants";
import axios from "axios";
import styled from "styled-components";

const CurrentTrack = () => {
	const [{ token, currentlyPlaying }, dispatch] = useStateProvider();
	// console.log(currentlyPlaying);
	useEffect(() => {
		const getCurrentTrack = async () => {
			const response = await axios.get(
				"https://api.spotify.com/v1/me/player/currently-playing",
				{
					headers: {
						Authorization: "Bearer " + token,
						"content-type": "application/json",
					},
				}
			);

			if (response.data !== "") {
				// destrcturing response.data
				const { item } = response.data;
				const currentlyPlaying = {
					id: item.id,
					name: item.name,
					artists: item.artists.map((artist) => artist.name),
					image: item.album.images[2].url,
				};
				// console.log(currentlyPlaying);
				dispatch({ type: reducerCases.SET_PALYING, currentlyPlaying });
			} else {
				dispatch({ type: reducerCases.SET_PALYING, currentlyPlaying: null });
			}
		};
		getCurrentTrack();
	}, [token, dispatch]);
	return (
		<Container>
			{/* {currentlyPlaying && <div>lol</div>} */}
			{currentlyPlaying && (
				<div className="track">
					<div className="track__image">
						<img src={currentlyPlaying.image} alt="currentPlaying" />
					</div>
					<div className="track__info">
						<h4 className="track__info__track__name">
							{currentlyPlaying.name}
						</h4>
						<h6 className="track__info__track__artists">
							{currentlyPlaying.artists.join(", ")}
						</h6>
					</div>
				</div>
			)}
		</Container>
	);
};

const Container = styled.div`
	.track {
		display: flex;
		align-items: center;
		gap: 1rem;
		&__image {
		}
		.track__info {
			display: flex;
			flex-direction: column;
			gap: 0.3rem;
			&__track__name {
				color: white;
			}
			&__track__artists {
				color: #b3b3b3;
			}
		}
	}
`;
export default CurrentTrack;
