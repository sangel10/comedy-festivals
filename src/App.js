import React from 'react';
import './App.css';
// import Form from './Form';
import MailchimpSubscribe from "react-mailchimp-subscribe"
const SUBMISSION_URL = `https://docs.google.com/forms/d/1mXr6sfQ-eBqXQIKKbcjN3xYfLkYijFtld_csSUKlEpk`;
const url = "https://gmail.us5.list-manage.com/subscribe/post?u=7e7e8f32f47f11423adeb4a69&amp;id=d71e7cf6f8";

function App() {
  return (
    <div className="App-header" >
      <h1>About/FAQ</h1>
      <h2>WTF is this? </h2>
        <p> If you sign up for this newsletter you'll get a regular email telling you which comedy festivals are accepting applications.</p>
      <h2>Why the fuck did you make this?</h2>
        <p>
          There's a ton of comedy festivals, nobody knows when the fuck to apply to them.
          I found as many as I could and then went on each of their websites and did my best
          to find the dates that applications open and close.
        </p>
      <h2>How accurate is this?</h2>
        <p>  Go look at those websites and see if you can find the dates.
          Just kidding, every website is a gift from God (who is Muslim btw).

          I did my best to find the dates on websites, however it's likely there are errors.
          If you would like to submit a change you can do so <a href={SUBMISSION_URL} target="_blank" rel="noopener noreferrer">HERE</a>.
        </p>

      <h2>How do I know this is legit? Where can I see the data</h2>
        <p>
          <a href="https://docs.google.com/spreadsheets/d/1f9JYuJCNmhzrikx7Thh4_N_kG-p1k2V_Vq5_m1C4pp4" target="_blank" rel="noopener noreferrer">You can see the data here.</a>
        </p>
      <h2>How can I add my festival?</h2>
        <p>
          <a href={SUBMISSION_URL} target="_blank" rel="noopener noreferrer">Fill this out </a>
        </p>
      <h2>The info you have for a festival is wrong, how can I change it?</h2>
        <p>
          Get the festival ID and <a href={SUBMISSION_URL} target="_blank" rel="noopener noreferrer">Fill this out.</a>
        </p>
      <h2>A note about fringe festivals</h2>
        <p>
          Please be aware that the dates for Fringe festivals are the first dates that submissions are open.
          However, many fringe festivals require you to go out and book your own venue, and these venues will have their own submission dates/process.
          Additionally some Fringes, like the Edinburgh Fringe for example are comprised of a bunch of smaller festivals.

          In Edinburgh for example you have Laughing Horse, PBH, Heroes, Monkey Barrel and then the paid venues.
          Each of these has their own application process and their own deadlines.

          Currently Fringe festivals just have a submission start and end date.
          If you're familiar with Fringe festivals and would like to submit the individual sub festival deadlines please do so.
          If the data structure needs to be changed to accomodate this please get in touch and I'll do so.
        </p>
      <h2>Contact</h2>
        <p><a target="_blank" rel="noopener noreferrer" href="mailto:comedyfestivals@gmail.com">E-mail me</a>.</p>
      <h2>Sign up for the newsletter</h2>
      <div className="mailchimp-container">
        <MailchimpSubscribe url={url} style={{ display: 'flex', alignItems: 'center' }}/>
      </div>
    </div>
  );
}

export default App;
