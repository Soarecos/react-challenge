import React from 'react';
import searchSuggestion from '../../assets/images/illustration-empty-state.png';
import './Suggestion.scss'

class Suggestion extends React.Component {
    render() {
        return (
            <div>
                <div className="searchSuggestion w-100">
                    <img src={searchSuggestion} className="searchSuggestion-image img-fluid" alt="searchSuggestion" />
                    <h4 className="searchSuggestion-title text-center mt-3">Don't Know what to search?</h4>
                    <p className="searchSuggestion-description text-center">Here's an offer you can't refuse</p>
                </div>
            </div>
        )
    }
}

export default Suggestion;