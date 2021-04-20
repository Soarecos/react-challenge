import React from "react";
import { BrowserRouter as Route } from "react-router-dom";
import './MovieDetails.scss';
import axios from 'axios';
import arrowBack from '../../assets/images/icon-arrow-grey.svg';
import rotten from '../../assets/images/logo-rotten-tomatoes.svg';
import imdb from '../../assets/images/logo-imdb.svg';
import NotFound from "../NotFound/NotFound";


class MovieDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results: {},
            fav: localStorage.getItem('WI-Movies').indexOf(window.location.href.split('/movie/')[1]) !== -1 ? true : false,
            redirect: false
        }

    }

    componentWillMount() {
        this.fetchSearchResults(window.location.href.split('/movie/')[1]);
    }

    // Get the information about the movie based on the imdbID on the router
    fetchSearchResults = (query) => {
        const searchUrl = `${process.env.REACT_APP_OMDBAPI}&i=${query}`;
        return new Promise((resolve) => {

            axios.get(searchUrl).then(res => {
                if (res.data.Response !== "False") {
                    this.setState({ results: res.data })
                }else{
                    this.setState({ redirect: true });
                }
                resolve(true);
            }).catch(error => {
                resolve(true);
            })
        });
    }

    // Add the movie to the favourites 
    addFav(result) {
        // Get the existing data on localstorage
        let oldItems = JSON.parse(localStorage.getItem('WI-Movies')) || [];

        let exists = oldItems.map(function (e) { return e.movie; }).indexOf(result);

        // Search if the id already exists on localstorage and add or remove from favourites
        if (exists === -1) {
            oldItems.push({ 'movie': result });

            this.setState({ fav: true });
        } else {
            for (let i = 0; i < oldItems.length; i++) {
                const item = oldItems[i];
                if (item.movie === result) {
                    oldItems.splice(i, 1);
                }
            }
            this.setState({ fav: false });
        }

        // Set the new object on localstorage
        localStorage.setItem('WI-Movies', JSON.stringify(oldItems));
    }

    render() {
        const result = this.state.results;
        const redirect = this.state.redirect;
        if (redirect) {
            return <NotFound />
        } else {
            let itemListActors = [];
            let itemListDirector = [];
            let itemListGenre = [];
            let itemListRatings = '-';
            if (Object.keys(result).length) {
                // Actors
                let itemsActors = result.Actors.split(',');
                itemsActors.forEach((item, index) => {
                    itemListActors.push(<li key={index}>{item}</li>)
                });

                // Genre
                let itemsGenre = result.Genre.split(',');
                itemsGenre.forEach((item, index) => {
                    itemListGenre.push(<li key={index}>{item}</li>)
                });

                // Director
                let itemsDirector = result.Director.split(',');
                itemsDirector.forEach((item, index) => {
                    itemListDirector.push(<li key={index}>{item}</li>)
                });

                // Ratings
                let itemsRatings = result.Ratings;
                itemsRatings.forEach((item) => {
                    if (item.Source === 'Rotten Tomatoes') {
                        itemListRatings = item.Value;
                    }
                });
            }
            return (
                <div>
                    {/* Movie Details */}
                    <div className="movieDetails">
                        <div className="row">
                            <div className="col-lg-12">
                                <Route render={({ history }) => (
                                    <img src={arrowBack} className="float-start mt-3 mb-3 go-back" alt="go back" onClick={() => { history.push(`/`) }} />
                                )} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 movieDetails-item">
                                <div className="movieDetails-time text-start mb-4">
                                    <span className="movieDetails-time--duration">{result.Runtime}</span>
                                    <span className="movieDetails-time--year">{result.Year}</span>
                                    <span className="movieDetails-time--real">{result.Rated}</span>
                                </div>
                                <div className="movie-Information text-start d-lg-none mb-4">
                                    <img src={result.Poster} className="img-fluid movieDetails-thumbnail" alt={result.Title} />
                                </div>
                                <h1 className="movieDetails-title text-start mb-4">{result.Title}</h1>

                                <div className="movieDetails-classification text-start mb-5">
                                    <div className="d-flex justify-content-start d-lg-inline-block">
                                        <div className="movieDetails-classification--imdb">
                                            <div className="movieDetails-classification-image">
                                                <img src={imdb} alt="movie Like" />
                                            </div>
                                            <span className="movieDetails-classification-text">{result.imdbRating}/10</span>
                                        </div>
                                        <div className="movieDetails-classification--rotten">
                                            <div className="movieDetails-classification-image">
                                                <img src={rotten} alt="movie Like" />
                                            </div>
                                            <span className="movieDetails-classification-text">{itemListRatings}</span>
                                        </div>
                                    </div>
                                    <button className={`movieDetails-classification--fav mt-3 mt-lg-0 ${this.state.fav ? 'active' : ''}`} onClick={this.addFav.bind(this, result.imdbID)}>
                                        <span className="movieDetails-classification-text"><i className="fa fa-heart-o" aria-hidden="true"></i> {this.state.fav ? 'Added' : 'Add to favourites'} </span>
                                    </button>
                                </div>
                                <div className="movieDetails-information">
                                    <div className="movieDetails-plot text-start mb-5">
                                        <h6 className="movieDetails-plot-title">Plot</h6>
                                        <p className="movieDetails-plot-description">{result.Plot}</p>
                                    </div>
                                    <div className="movieDetails-type text-start">
                                        <div className="row">
                                            <div className="col-6 col-lg-4 mb-4 mb-lg-0">
                                                <h6 className="movieDetails-type-title">Cast</h6>
                                                <ul className="movieDetails-type-description">
                                                    {itemListActors}
                                                </ul>
                                            </div>
                                            <div className="col-6 col-lg-4 mb-4 mb-lg-0">
                                                <h6 className="movieDetails-type-title">Genre</h6>
                                                <ul className="movieDetails-type-description">
                                                    {itemListGenre}
                                                </ul>
                                            </div>
                                            <div className="col-lg-4 mb-4 mb-lg-0">
                                                <h6 className="movieDetails-type-title">Director</h6>
                                                <ul className="movieDetails-type-description">
                                                    {itemListDirector}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-5 mb-lg-0 d-none d-lg-block">
                                <div className="movie-Information text-start h-100">
                                    <img src={result.Poster} className="img-fluid movieDetails-thumbnail h-100" alt={result.Title} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default MovieDetails;