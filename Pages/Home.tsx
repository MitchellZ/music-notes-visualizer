import * as React from 'react';
import '../style.css';

import { useState } from 'react';

// Initializing Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyCFy8u7W1OT1-sRF5aTI4Qn3Z7k3_eJx3s',
  authDomain: 'react-trivia-generator.firebaseapp.com',
  projectId: 'react-trivia-generator',
  storageBucket: 'react-trivia-generator.appspot.com',
  messagingSenderId: '425929609914',
  appId: '1:425929609914:web:fe481e73d643a82c0aa883',
  measurementId: 'G-FWGCCGGD6N',
});

const firestore = firebase.firestore();

let amount = '10';
let category = '';
let difficulty = '';
let type = 'multiple';
var slideIndex = 0;
var numSlides = 0;

// Defining the Home component
const Home = () => {
  // This function handles the Trivia Slideshow
  function carousel() {
    var i;
    var x = document.querySelectorAll<HTMLElement>('.slide');
    numSlides = x.length;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > x.length) {
      slideIndex = 1;
    }
    x[slideIndex - 1].style.display = '';
  }

  // This function handles making the Trivia slides fullscreen
  function goFullscreen() {
    slideIndex -= 1;
    var elements = document.getElementsByClassName('slides');
    var elem = elements[0];
    elem.requestFullscreen();
  }

  let lastKey = 'none';

  document.onkeydown = function (event) {
    if (lastKey != event.key) {
      lastKey = event.key;
      changeSlides(event);
    }
  };

  document.onkeyup = function (event) {
    if (lastKey == event.key) {
      lastKey = 'none';
    }
  };

  // This function allows the user to change slides with the mouse or arrow keys
  function changeSlides(event) {
    const localX = event.clientX - event.target.offsetLeft;
    if (localX >= 30) carousel();
    if (localX < 30) {
      if (slideIndex - 2 == -1) slideIndex = numSlides - 1;
      else slideIndex -= 2;
      carousel();
    }
    switch (event.keyCode) {
      case 37:
        if (slideIndex - 2 == -1) slideIndex = numSlides - 1;
        else slideIndex -= 2;
        carousel();
        break;
      case 39:
        carousel();
        break;
    }
  }

  // Fetch codes corresponding to categories from OpenTriviaDatabase API
  let categoryCodes;

  fetch('https://opentdb.com/api_category.php')
    .then((response) => response.json())
    .then((data) => {
      categoryCodes = data.trivia_categories;
    });

  const updateCategory = (event) => {
    let newCategory = event.target.value;
    if (newCategory === 'Any Category') {
      category = '';
    } else {
      //Set category code logic
      for (let i = 0; i < categoryCodes.length; i++) {
        if (categoryCodes[i].name == newCategory)
          category = categoryCodes[i].id;
      }
    }

    updateUrl();
  };

  const updateAmount = (event) => {
    let newAmount = event.target.value;
    setNum(newAmount);
    if (newAmount < 1 || newAmount > 50) {
      event.target.classList.add('invalid');
      document.querySelector<HTMLElement>('#form_error').style.display = '';
      amount = '10';
    } else {
      event.target.classList.remove('invalid');
      document.querySelector<HTMLElement>('#form_error').style.display = 'none';
      amount = newAmount;
    }

    updateUrl();
  };

  const updateDifficulty = (event) => {
    let newDifficulty = event.target.value;
    if (newDifficulty === 'Any Difficulty') difficulty = '';
    if (newDifficulty === 'Easy') difficulty = 'easy';
    if (newDifficulty === 'Medium') difficulty = 'medium';
    if (newDifficulty === 'Hard') difficulty = 'hard';

    updateUrl();
  };

  const updateType = (event) => {
    let newType = event.target.value;
    if (newType === 'Any Type') type = '';
    if (newType === 'Multiple Choice') type = 'multiple';
    if (newType === 'True/False') type = 'boolean';

    updateUrl();
  };

  let displayData;

  const [number, setNum] = useState(10);
  const [showPosts, setShowPosts] = useState();
  const [answerKeyLink, setAnswerKeyLink] = useState('');

  // Initializes the URL for calling OpenTriviaDatabase
  let apiUrl =
    'https://opentdb.com/api.php?amount=' +
    amount +
    '&category=' +
    category +
    '&difficulty=' +
    difficulty +
    '&type=' +
    type +
    '&encode=url3986';

  // Updates the URL for calling OpenTriviaDatabase with the latest variable values
  // This is called by the functions that update those variables
  const updateUrl = () => {
    apiUrl =
      'https://opentdb.com/api.php?amount=' +
      amount +
      '&category=' +
      category +
      '&difficulty=' +
      difficulty +
      '&type=' +
      type +
      '&encode=url3986';
  };

  // Firestore variables
  const keysRef = firestore.collection('keys');
  const query = keysRef;

  const [keys] = useCollectionData(query);

  // This function uses the OpenTriviaDatabase API to generate trivia slides
  const pullJson = (event) => {
    event.preventDefault();

    // HTTP request to API. Sets displayData to JSX elements representing slides
    fetch(apiUrl)
      .then((response) => response.json())
      .then((responseData) => {
        displayData = responseData.results.map((item, index) => {
          return (
            <div className="slide" key={index} style={{ display: 'none' }}>
              <p id="slideText">
                {index + 1}. {decodeURIComponent(item.question)}
              </p>
            </div>
          );
        });

        // Logs the slide data generated from the API for debugging
        //console.log(responseData.results)

        // Add answer key to database with id 1 greater than the highest key (previous id)
        let newId = Math.max(...keys.map((x) => x.id)) + 1;
        keysRef.add({
          id: newId,
          answers: responseData,
        });

        // Update the link to the answer key page with the new ID
        setAnswerKeyLink(
          'https://react-trivia-generator.stackblitz.io/Answers?id=' + newId
        );

        // Set the state to display the newly retrieved data
        setShowPosts(displayData);
      });
  };

  const noResults = () => {
    document.querySelector<HTMLElement>('.slides').style.display = 'none';
    document.querySelector<HTMLElement>('.keyLink').style.display = 'none';
    document.querySelector<HTMLElement>('.keyLabel').style.display = 'none';
    document.querySelector<HTMLElement>('.noResults').style.display = '';
  };

  // This function returns true if the form input is valid
  const validateForm = async () => {
    // Checks if the input number is between 1-50 as required by the API
    if (
      Number(document.querySelector('input').value) >= 1 &&
      Number(document.querySelector('input').value) <= 50
    ) {
      if (
        (await fetch(apiUrl)
          .then((response) => response.json())
          .then((responseData) => responseData.response_code)) != 1
      ) {
        return true;
      } else {
        noResults();
        return false;
      }
    } else {
      document.querySelector('input').scrollIntoView();
      return false;
    }
  };

  // Handles click of the "Generate" button
  const generateHandle = async (event) => {
    let validation = await validateForm();
    if (validation) {
      document.querySelector<HTMLElement>('.noResults').style.display = 'none';
      document.querySelector<HTMLElement>('.slides').style.opacity = '0.85';
      setTimeout(() => {
        slideIndex = 0;
        setTimeout(carousel);
        pullJson(event);
        document.querySelector<HTMLElement>('.slides').style.opacity = '1';
        document.querySelector<HTMLElement>('.slides').style.display = '';
        document.querySelector<HTMLElement>('.keyLink').style.display = '';
        document.querySelector<HTMLElement>('.keyLabel').style.display = '';
      }, 50);
    }
  };

  // This section handles interaction with the Answer Key link
  const copyLink = () => {
    // Copy the text inside the text field
    navigator.clipboard.writeText(answerKeyLink);
  };

  let drag = false;

  document.addEventListener('mousedown', () => (drag = false));
  document.addEventListener('mousemove', () => (drag = true));

  const openLink = () => {
    if (!drag) window.open(answerKeyLink, '_blank');
  };

  // Begin HTML Template
  return (
    <div id="container">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <div className="nav">
        <ul>
          <li>
            <a className="active" href="/">
              TRIVIA GENERATOR
            </a>
          </li>
          <li className="about">
            <a href="/About">About</a>
          </li>
        </ul>
      </div>
      <div className="main_body">
        <div className="welcome">
          <h1>Welcome to Trivia Generator!</h1>
        </div>
        <section className="parameters_form">
          <p>Enter your parameters below</p>
          <br />
          <label>Number of Questions</label>
          <br />
          <div className="input_item">
            <input
              onChange={updateAmount}
              type="number"
              min="1"
              max="50"
              value={number}
            />
            <p id="form_error" style={{ display: 'none' }}>
              Must be between 1-50.
            </p>
          </div>
          <br />
          <label>Category</label>
          <br />
          <div className="input_item">
            <select onChange={updateCategory}>
              <option>Any Category</option>
              <option>General Knowledge</option>
              <option>Entertainment: Books</option>
              <option>Entertainment: Film</option>
              <option>Entertainment: Music</option>
              <option>Entertainment: Musicals & Theatres</option>
              <option>Entertainment: Television</option>
              <option>Entertainment: Video Games</option>
              <option>Entertainment: Board Games</option>
              <option>Science & Nature</option>
              <option>Science: Computers</option>
              <option>Science: Mathematics</option>
              <option>Mythology</option>
              <option>Sports</option>
              <option>Geography</option>
              <option>History</option>
              <option>Politics</option>
              <option>Art</option>
              <option>Celebrities</option>
              <option>Animals</option>
              <option>Vehicles</option>
              <option>Entertainment: Comics</option>
              <option>Science: Gadgets</option>
              <option>Entertainment: Japanese Anime & Manga</option>
              <option>Entertainment: Cartoon & Animations</option>
            </select>
          </div>
          <br />
          <label>Difficulty</label>
          <br />
          <div className="input_item">
            <select onChange={updateDifficulty}>
              <option>Any Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <br />
          <label>Type</label>
          <br />
          <div className="input_item">
            <select defaultValue="Multiple Choice" onChange={updateType}>
              <option>Any Type</option>
              <option>Multiple Choice</option>
              <option>True/False</option>
            </select>
          </div>
          <br />
          <button type="button" onClick={generateHandle}>
            Generate
          </button>
        </section>
        <br />
        <section
          className="slides"
          onClick={changeSlides}
          style={{ display: 'none' }}
        >
          <div className="slide" style={{ display: 'none' }}>
            <p id="slideText">TRIVIA</p>
          </div>
          {showPosts}
          <p id="fullscreen">
            <span className="material-symbols-outlined" onClick={goFullscreen}>
              fullscreen
            </span>
          </p>
        </section>

        <section className="noResults" style={{ display: 'none' }}>
          <br />
          <p style={{ color: 'red' }}>
            Failed! Not enough questions to fulfill parameters.
          </p>
          <p>Please modify your parameters and try again.</p>
        </section>

        <section className="answerKey">
          <div className="keyDisplay">
            <label className="keyLabel" style={{ display: 'none' }}>
              Answer Key
            </label>
            <br />
            <div className="keyLink" style={{ display: 'none' }}>
              <input
                id="linkText"
                type="text"
                value={answerKeyLink}
                onClick={openLink}
                readOnly
              />{' '}
              <div id="copyButton" onClick={copyLink}>
                <span className="material-symbols-outlined">content_copy</span>
              </div>
            </div>
          </div>
        </section>

        <div id="spacer"></div>
      </div>
      <footer>
        <ul>
          <li className="title">Trivia Generator developed by Mitchell Zoph</li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;
