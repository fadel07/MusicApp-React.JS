import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar'
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state = { 
      searchResults:[],
      playListName: 'My PlayList',
      playlistTracks: []
    };
  }
  addTrack(track){
    let tracks= this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)){
      return; 
    }
    tracks.push(track);
    this.setState({
      playlistTracks: tracks
    })
  }
  removeTrack(track){
    let tracks=this.state.playlistTracks;
    tracks = tracks.filter(current => current.id !== track.id);
    this.setState({playlistTracks: tracks});
  }
  updatePlaylistName(name){
    this.setState({playListName: name})
  }
  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playListName, trackUris).then(() => {
       this.setState({
        playListName: 'New Playlist',
        playlistTracks:[]
      })
    })
    
  }
  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }
  render() {
    return <div>
      <h1>Ja<span className='highlight'>mm</span>ing</h1>
      <div className='App'>
        <SearchBar onSearch={this.search} />
        <div className='App-playlist'>
          <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
          <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playListName={this.state.playListName} playlistTracks={this.state.playlistTracks}/>
        </div>
      </div>
    </div>
  }
}
export default App;
