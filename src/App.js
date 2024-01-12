import './App.css';
import { useEffect, useState } from "react";
import BreakingNews from './BreakingNews';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function App() {
  
  const [selectedDate, setSelectedDate] = useState(null);

  let [category, setCategory] = useState("india");

  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const maxRequestsPerDay = 100;

  let [articles, setArticles] = useState([]);

  useEffect(() => {
    // Initialize formattedDate as an empty string
    let formattedDate = '';

    // Check if a valid date is selected before making the API request
    if (selectedDate && selectedDate instanceof Date) {
      formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    }
    // Check if the request count is below the limit
    if (requestCount < maxRequestsPerDay) {
      // Increment the request count
      setRequestCount(requestCount + 1);
      fetch(`https://newsapi.org/v2/everything?q=${category}&${formattedDate}&apiKey=f6c1649e74304d65a3a369a7bba759bf`)
      .then(response => {
        if (response.status === 429) {
          // Too Many Requests, implement backoff (e.g., wait for a few seconds before retrying)
          console.warn('Too many requests. Backing off...');
          return new Promise(resolve => setTimeout(resolve, 5000)).then(() => response);
        }
        return response;
      })  
      .then(response => response.json())
        .then((news) => {
          setArticles(news.articles);
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      // Set the state to indicate that the daily limit is reached
      setDailyLimitReached(true);
      // console.warn('Daily request limit reached. You cannot make more requests.');
    }
  }, [category, selectedDate, requestCount])

  return (
    <div className="App">
      <header className="header">

        <h1>NewsNucleus</h1>

        <div className='header-right'>

        <label>Date: </label>
          <DatePicker className='date'
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
          />
  
          <input className='searchbox' type="text" onChange={(event) => {
            if (event.target.value !== "") {
              setCategory(event.target.value);
            } else {
              setCategory("india");
            }
          }} placeholder="Search News"></input>
        </div>

      </header>

      {dailyLimitReached ? (
        <div className="daily-limit-reached-message">
          <p>Daily request limit reached. You cannot make more requests.</p>
        </div>
      ) : (
        <section className="news-articles">
          {
            articles.length !== 0 ? (
              articles.map((article, index) => (
                <BreakingNews key={index} article={article} />
              ))
            ) : (
              <h3>No News Found For Searched Text</h3>
            )
          }
        </section>
      )}
    </div >

  );
}

export default App;