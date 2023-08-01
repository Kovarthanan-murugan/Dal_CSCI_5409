import React from 'react';
import './landingPage.css'; // Import the CSS file for styling
import Path from '../../constants/path'; // Import the path constants for routing
import { Link } from 'react-router-dom'; // Import Link from 'react-router-dom' to enable navigation within the app

function landingPage() {
	// This component represents the landing page of the application

	return (
		<div>
			<div className="landing_page_title">Tax Document Reader</div>
			<div className="login_and_registration_btn">
				{/* Link to navigate to the 'Upload' page using the defined 'Path.UPLOAD' constant */}
				<Link to={Path.UPLOAD} className="registration_btn">
					Upload Tax File
				</Link>

				{/* Link to navigate to the 'Details' page using the defined 'Path.DETAILS' constant */}
				<Link to={Path.DETAILS} className="registration_btn">
					Get Details
				</Link>
			</div>
		</div>
	);
}

export default landingPage;
