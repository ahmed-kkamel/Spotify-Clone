import { reducerCases } from "./constants";

export const initialState = {
	token: "",
	playlists: [],
	user: null,
	playlistId: "03vvMlv5Dxn89F1crwwLSv",
	selectedPlaylist: null,
	currentlyPlaying: null,
	playerState: false,
};
function reducer(state, action) {
	switch (action.type) {
		case reducerCases.SET_TOKEN:
			return {
				...state,
				token: action.token,
			};
		case reducerCases.SET_PLAYLISTS:
			return { ...state, playlists: action.playlists };
		case reducerCases.SET_USER:
			return { ...state, userInfo: action.userInfo };
		case reducerCases.SET_PLAYLIST:
			return { ...state, selectedPlaylist: action.selectedPlaylist };
		case reducerCases.SET_PALYING:
			return { ...state, currentlyPlaying: action.currentlyPlaying };
		case reducerCases.SET_PLAYER_STATE:
			return { ...state, playerState: action.playerState };
		case reducerCases.SET_PLAYLIST_ID:
			return { ...state, playlistId: action.playlistId };
		default:
			return state;
	}
}

export default reducer;
