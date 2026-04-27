import React from "react";
import { Button, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AddInfo = ({info, application, rsvpAction, cancelRsvpAction}) => {

	if (application)
	{
		if (process.env["decisions_released"] === "true")
		{
			var rsvpDiv = <div></div>;
			if (application.rsvp === null)
			{
				if (process.env["rsvp_open"] === "true")
				{
					rsvpDiv =
						<div>
							<Button fluid color="teal" onClick={rsvpAction}>RSVP</Button>
							<Button fluid color="red" onClick={cancelRsvpAction}>I will not be attending</Button>
						</div>;
				}
			}
			else if (application.rsvp === true)
			{
				if (process.env["rsvp_open"] === "true")
				{
					rsvpDiv = 
						<div>
							<p className="body-text">Your <strong>RSVP</strong> has been noted. We look forward to seeing you at SB Hacks! If you can no longer attend, let us know below.</p>
							<Button fluid color="red" onClick={cancelRsvpAction}>I will not be attending</Button>
						</div>;
				}
				else
				{
					rsvpDiv = 
						<div>
							<p className="body-text">Your <strong>RSVP</strong> has been noted. We look forward to seeing you at SB Hacks!</p>
						</div>;
				}
			}
			else
			{
				if (process.env["rsvp_open"] === "true")
				{
					rsvpDiv = 
						<div>
							<p className="body-text">Thank you for letting us know you will not be attending this year. Hope to see you at the next SB Hacks! If you change your mind and can still attend, let us know below.</p>
							<Button fluid color="teal" onClick={rsvpAction}>RSVP</Button>
						</div>;
				}
				else
				{
					rsvpDiv = 
						<div>
							<p className="body-text">Thank you for letting us know you will not be attending this year. Hope to see you at the next SB Hacks!</p>
						</div>;
				}
			}
			if (application.accepted===true)
			{
				var rsvpPrompt=<div></div>
				
				if (process.env["rsvp_open"] === "true")
				{
					rsvpPrompt =
						<div>
							<p className="body-text">Please <strong>RSVP</strong> below, no later than <strong>Friday, January 3rd</strong>. If you will not be attending, please let us know as well so we can open up more spots for others.</p>
							<p className="body-text">If you decide to RSVP, head on over to our facebook event page at <a href="http://www.sbhacks.com/fb-event" target="_blank">www.sbhacks.com/fb-event</a> and click "Going"!</p>
							<p className="body-text">Also, join the SB Hacks VI slack at <a href="http://www.sbhacks.com/slack"  target="_blank">www.sbhacks.com/slack</a> to get a headstart on connecting with other hackers! See you soon!</p>
						</div>;
				}
				else
				{
					if (application.rsvp===true)
					{
						rsvpPrompt =
							<div>
								<p className="body-text">Please <strong>RSVP</strong> below, no later than <strong>Friday, January 3rd</strong>. If you will not be attending, please let us know as well so we can open up more spots for others.</p>
								<p className="body-text">If you decide to RSVP, head on over to our facebook event page at <a href="http://www.sbhacks.com/fb-event" target="_blank">www.sbhacks.com/fb-event</a> and click "Going"!</p>
								<p className="body-text">Also, join the SB Hacks VI slack at <a href="http://www.sbhacks.com/slack" target="_blank">www.sbhacks.com/slack</a> to get a headstart on connecting with other hackers! See you soon!</p>
							</div>;
					}
					else
					{
						rsvpPrompt =
							<div>
								<p className="body-text">Unfortunately, you just missed the deadline to RSVP on Friday, January 3rd. Email us at <a href="mailto:team@sbhacks.com">team@sbhacks.com</a> if you have any questions or concerns!</p>
							</div>;
					}
				}
				return (
					<div className="body">
						<p className="body-text">Congratulations!</p>
						<p className="body-text">The SB Hacks team is delighted to inform you that you’ve been accepted as a participant for SB Hacks VI! We were impressed with your application and look forward to seeing your project during January 10-12, 2020.</p>
						<p className="body-text">Information regarding transportation will soon be emailed to you, so keep your eye out for that! This year, we’ll be providing buses and travel reimbursements on a case-by-case basis.</p>
						{ rsvpPrompt }
						<br />
						{ rsvpDiv }
					</div>
				);
			}
			else if (application.accepted===false)
			{
				/* REJECTED */
				return (
					<div className="body">
						<p className="body-text">We had an extremely competitive applicant pool this year with only 400 spots available, and unfortunately, we are unable to offer you admission to SB Hacks VI. We hope to see your application next year!</p>
					</div>
				);
			}
			else
			{
				/* WAITLISTED */
				/*
				return (
					<div className="body">
						<p className="body-text">Thank you for your interest in SB Hacks VI. Your application is currently still under consideration at this time. </p>
						<p className="body-text">We’ll be sending you an email soon when we have an update for you. Until then, join the Facebook event page at <a href="http://www.sbhacks.com/fb-event" target="_blank">sbhacks.com/fb-event</a> to stay up-to-date with other opportunities to get involved with our hackathon, giveaways, and important announcements!</p>
					</div>
				);
				*/

				/* WAITLISTED - UCSB Walk-ins */
				return (
					<div className="body">
						<p className="body-text">Thank you for your interest in SB Hacks VI. Unfortunately, we are unable to guarantee you admission to SB Hacks VI. </p>
						<p className="body-text">Since you attend UCSB, we would still like to offer you a spot on the waitlist.</p>
						<p className="body-text">If you’re interested, come to SB Hacks on Friday, January 10, after 7 PM to see if we can accommodate you. We will let you into the event if there’s space. In the past, many people have been able to get in this way, so please arrive on time! </p>
						<p className="body-text">Until then, join the Facebook event page at <a href="http://www.sbhacks.com/fb-event" target="_blank">sbhacks.com/fb-event</a> to stay up-to-date with other opportunities to get involved with our hackathon, giveaways, and important announcements!</p>
					</div>
				);
			}
		}
		else
		{
			return (
				<div>
					<div className="body">
						<p className="body-text">We are currently reviewing your application. If you don't see an update by January 5th, please email us at <a href="mailto:team@sbhacks.com">team@sbhacks.com</a>.</p>
					</div>
					{
						process.env["apps_released"] === "true" ?
						(
							<Container textAlign='center'>
								<Link to="/edit" id="apply-link"><Button color="blue">Edit Application</Button></Link>
							</Container>
						) : null
					}
				</div>
			);			
		}
	}
	else
	{
		if (process.env["apps_released"] === "true") {
			return (
				<div>
					<div className="body">
						<p className="body-text">You have not yet applied. Applications are due December 13th.</p>
						<Container textAlign='center'>
							<Link to="/apply" id="apply-link"><Button color="blue">Start Application</Button></Link>
						</Container>
					</div>

				</div>
			);
		}
		else {
			return (
				<div>
					<div className="body">
						<p className="body-text">Applications are now closed. Please email us at <a href="mailto:team@sbhacks.com">team@sbhacks.com</a> if you have any questions.</p>
					</div>

				</div>
			);
		}
	}
};

export default AddInfo;