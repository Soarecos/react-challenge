import React from 'react';
import { Route } from "react-router-dom";
import './NotFound.scss';
import notFound from '../../assets/images/404.png';

class NotFound extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <img src={notFound} className="img-fluid notFound-img" alt="404"/>
                <h2 className="notFound-title mt-5">D'oh... We couldn't find the page you're looking for.</h2>
                <Route render={({ history }) => (
                <button className="notFound-btn mt-4" onClick={() => { history.push(`/`) }} >
                    Search again
                </button>
                )} />
            </div>
        )
    }
}

export default NotFound;