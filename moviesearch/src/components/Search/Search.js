import React from 'react';
import { Route } from "react-router-dom";
import './Search.scss';
import axios from 'axios';
import Suggestion from '../../components/Suggestion/Suggestion';
import Loading from '../../components/Loading/Loading';
import searchIcon from '../../assets/images/icon-magnifier-grey.svg';

class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: ''
        }

        this.cancel = '';
    }

    // Fetch the results on the API based on the query param
    fetchSearchResults = (query) => {
        const searchUrl = `${process.env.REACT_APP_OMDBAPI}&s=${query}`;
        return new Promise ((resolve) => {

            // Cancel the request if the user is "multityping" to prevent a lot of request on the API
            if (this.cancel) {
                this.cancel.cancel();
            }

            this.cancel = axios.CancelToken.source();

            axios.get(searchUrl, {
                cancelToken: this.cancel.token
            }).then(res => {
                const resultNotFoundMsg = res.data.length ? 'There are no search results.' : '';
                if(res.data.Response !== "False"){
                    this.setState({
                        results: res.data,
                        message: resultNotFoundMsg,
                        loading: false
                    })
                }else{
                    if(res.data.Error === 'Too many results.'){
                        this.setState({
                            results: res.data,
                            message: 'Please search with 3 or more letters',
                            loading: false
                        })
                    }else if(res.data.Error === 'Movie not found!'){
                        this.setState({
                            results: res.data,
                            message: 'Oops.. ',
                            loading: false
                        })
                    }else{
                        this.setState({
                            results: res.data,
                            message: resultNotFoundMsg,
                            loading: false
                        })
                    }
                }
                resolve(true);
            }).catch(error => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false
                    })
                }
                resolve(true);
            })
        });
    }

    handleOnInputChange = (event) => {
        const query = event.target.value;
        this.setState({ query, loading: true, message: '' }, () => {
            this.fetchSearchResults(query);
        });
    };

    viewMovieDetails(history, movieDetails) {
        history.push(`/movie/${movieDetails.imdbID}`);
    }

    addFav(result) {
        // Get the existing data on localstorage
        let oldItems = JSON.parse(localStorage.getItem('WI-Movies')) || [];

        let exists = oldItems.map(function (e) { return e.movie; }).indexOf(result);
        
        // Search if the id already exists on localstorage and add or remove from favourites
        if (exists === -1) {
            oldItems.push({ 'movie' : result });
        
            this.setState({ fav: true });
        } else {
            for (let i = 0; i < oldItems.length; i++) {
                const item = oldItems[i];
                if(item.movie === result){
                    oldItems.splice(i, 1); 
                }
            }
            this.setState({ fav: false });
        }
  
        // Set the new object on localstorage      
        localStorage.setItem('WI-Movies', JSON.stringify(oldItems));
    }

    renderSearchResults = () => {
        const { results } = this.state;
        const moviesFav =  JSON.stringify(localStorage.getItem('WI-Movies'));
        if (Object.keys(results).length) {
            if (results.Response.toLocaleLowerCase() !== 'false') {
                return (
                    <div className="searchResults">
                        <div className="row">
                            {results.Search.map(movie => (
                                <div className={`col-6 col-lg-2 searchResults-item ${moviesFav.indexOf(movie.imdbID) !== -1 ? 'fav' : ''}`}>
                                    <Route render={({ history }) => (
                                        <div className="movie-Information text-start" onClick={() => { this.viewMovieDetails(history, movie) }}>
                                            <img src={movie.Poster} className="img-fluid movie-Information--image" alt="Movie Name" />
                                            <i className="fa fa-heart movie-Information-fav movie-Information-like" aria-hidden="true"></i>
                                            <div className="movie-Information-description">
                                                <i className="fa fa-heart movie-Information-like" aria-hidden="true" onClick={this.addFav.bind(this, movie.imdbID)}></i>
                                                <div className="movie-Information-description-wrapper">
                                                    <p className="movie-Information-description--title mb-2">{movie.Title}</p>
                                                    <span className="movie-Information-description--year">{movie.Year}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )} />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }else if(results.Response === 'Movie not found!'){
                <h1>xuxas</h1>
            }
        }
    }

    render() {
        const { query, loading, message } = this.state;

        return (
            <div>
                <div className="searchBar">
                    <img src={searchIcon} className="searchBar-icon" alt="searchIcon" />
                    <input type="text" value={query} name="query" className="searchBar-input" id="search-input" placeholder="Search movies..." onChange={this.handleOnInputChange} />
                </div>
                {/* Error Message */}
                {message && <p className="error mt-5">{message}</p>}
                {/* Loader */}
                {loading && <Loading />}
                {/* Results */}
                {this.renderSearchResults()}
                {!query && <Suggestion />}
            </div>
        )
    }
}

export default Search;