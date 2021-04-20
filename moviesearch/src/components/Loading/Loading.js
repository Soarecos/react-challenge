import React from 'react';
import './Loading.scss'

class Loading extends React.Component {
    render() {
        return (
            <div>
                <div className="loading">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                </div>
            </div>
        )
    }
}

export default Loading;