const clientId= '08ab9a0e281d490fbaad8e7bdf7f43b3';
const redirectUrl = 'clean-cars.surge.sh'

let accessToken;
export const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        //check for access token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        
        if(accessTokenMatch && expiresInMatch ){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}
            `;
            window.location = accessUrl;
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}
        `,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(Response =>{
            return Response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track =>({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },
    savePlaylist(name, trackUris){
        if(name || trackUris.length){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        const userId ='';
        return fetch('https://api.spotify.com/v1/me',{headers: headers}
        ).then(Response => Response.json()
        ).then(jsonResponse =>{
            userId = jsonResponse;
            return fetch(`https://api.spotify.com//v1/users/${userId}/playlists`,
            {
                headers:headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(Response => Response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse;
                return fetch(`https://api.spotify.com//v1/users/${userId}/playlists/${playlistID}/tracks`,
                {
                    headers:headers,
                    method:'POST',
                    body: JSON.stringify( {uris: trackUris})
                })
            })
        })
    }

}