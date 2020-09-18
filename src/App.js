import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import './App.scss';
import { createBrowserHistory } from 'history';
import { MuiThemeProvider } from '@material-ui/core';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import { Header, Home, Algo } from './pages';
import scssVariables from './App.scss';

const history = createBrowserHistory();

let theme = responsiveFontSizes(createMuiTheme({
	palette: {
		primary: {
			main: scssVariables.primary,
			contrastText: '#444'
		},
		secondary: {
			main: scssVariables.secondary,
			contrastText: '#444'
		},
		danger: {
			main: scssVariables.danger,
			contrastText: '#444'
		},
		warning: {
			main: scssVariables.warning,
			contrastText: '#444'
		},
		info: {
			main: scssVariables.info,
			contrastText: '#444'
		}
	},
	typography: {
		h4: {
			fontFamily: 'Montserrat-Bold',
			color: '#444'
		}
	}
}));

function App() {
	return (
		<MuiThemeProvider theme={theme}>
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
		</MuiThemeProvider>
	);
}

export default App;
