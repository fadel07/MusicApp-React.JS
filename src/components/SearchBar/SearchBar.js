import React from 'react';
import '../SearchBar/SearchBar.css'

export class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    handleTermChange(e){
        this.setState({term: e.target.value})
    }
    search(){
        this.props.onSearch(this.state.term)
    }
    render() {
        return (
            <div className='SearchBar'>
                <input onChange={this.handleTermChange} placeholder='Enter A song, Album, or Artist'/>
                <button onClick ={this.search} className='SearchButton'>SEARCH</button>
            </div>
        )
    }
}