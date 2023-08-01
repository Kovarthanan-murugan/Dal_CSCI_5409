import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Path from './constants/path';

import LandingPage from './pages/landingPage/landingPage';
import Upload from './components/upload/uploadData'
import Details from './components/details/getDetails'
function App() {
	return (
		<>
			{/* all routes will be defined here */}
			<Routes>
				<Route
					path={Path.HOME}
					element={<LandingPage />}
				/>

				<Route
					path={Path.UPLOAD}
					element={<Upload/>}
				/>
				<Route
					path={Path.DETAILS}
					element={<Details/>}
				/>

			</Routes>
		</>
	);
}

export default App;
