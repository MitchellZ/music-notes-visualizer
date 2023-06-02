import * as React from 'react';
import '../style.css';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

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

// Defining the Answers component
const Answers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const id = Number(searchParams.get('id'));

  const [answers, setAnswers] = useState<any | null>(null);

  const keysRef = firestore.collection('keys');
  const query = keysRef;

  const [keys] = useCollectionData(query);

  useEffect(() => {
    //Runs on every render, gets answers to display
    if (keys != null) {
      getAnswers();
    }
  }, [keys]);

  // Gets sets answers to answers from Firestore or indicates invalid ID
  function getAnswers() {
    const answerKey = keys.find(x => x.id === id);
  
    // Check if the answer key exists for the given session ID
    if (!answerKey) {
      setAnswers(
        <div>
          <p id="answers">Session ID expired or invalid.</p>
        </div>
      );
      return;
    }
  
    // Map over the results and create an element for each question and answer
    setAnswers(
      answerKey.answers.results.map((item, index) => {
        let incorrectAnswers = null;
  
        // If the question type is not "boolean", render the incorrect answers
        if (decodeURIComponent(item.type) !== "boolean") {
          incorrectAnswers = item.incorrect_answers.map((answer, i) => (
            <div key={`incorrect_div_${i}`}>
            <p key={`incorrect_${i}`} className="incorrect">
              {decodeURIComponent(answer)}
            </p>
            <br />
            </div>
          ));
        }
  
        // Returns JSX elements representing trivia questions and answers
        return (
          <div key={`result_${index}`}>
            <p key={`question_${index}`} className="question">
              {index+1 + '. ' + decodeURIComponent(item.question)}
            </p>
            <br />
            <p key={`correct_${index}`} className="correct">
              {decodeURIComponent(item.correct_answer)}
            </p>
            <br />
            {incorrectAnswers}
            <div key={`spacer_${index}`} id="spacer" />
          </div>
        );
      })
    );
  }
  
   // Begin HTML Template
  return (
    <div>
      <div className="nav">
        <ul>
          <li>
            <Link to="/" className="active">
              TRIVIA GENERATOR
            </Link>
          </li>
          <li className="about">
            <Link to="/About" className="active">
              About
            </Link>
          </li>
        </ul>
      </div>
      <div className="main_body">
        <div className="welcome">
          <h1>ANSWER KEY</h1>
        </div>
        <div className='answer_key'>
        <br />
          {answers}
          </div>
      </div>
      <footer>
        <ul>
          <li className="title">Trivia Generator developed by Mitchell Zoph</li>
        </ul>
      </footer>
    </div>
  );
};

export default Answers;
