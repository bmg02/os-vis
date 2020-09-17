import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import './App.scss';
import { createBrowserHistory } from 'history';


import { Header, Home, Algo } from './pages';

const history = createBrowserHistory();

function App() {
	return (
		<Router history={history}>
			<Header />
			<Route render={({ location }) => (
				<div className='main-container'>
						<Switch location={ location }>
							<Route exact path='/' component={Home} />
							<Route exact path='/:algo' component={Algo} />
						</Switch>
				</div>
			)} />
		</Router>
	);
}

export default App;
