import './App.css';
import { useEffect, useState } from "react";
import BreakingNews from './BreakingNews';

function App() {

  let [category, setCategory] = useState("india");

  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const maxRequestsPerDay = 100;

  let [articles, setArticles] = useState([]);

  useEffect(() => {
    
    // Check if the request count is below the limit
    if (requestCount < maxRequestsPerDay) {
      // Increment the request count
      setRequestCount(requestCount + 1);
      fetch(`https://newsapi.org/v2/everything?q=${category}&2023-12-20&apiKey=fb8b2d3ffb2a4dc9a89f77aebde9a14a`)
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
      console.warn('Daily request limit reached. You cannot make more requests.');
    }
  }, [category, requestCount])

  return (
    <div className="App">
      <header className="header">

        <h1>NewsNucleus</h1>

        <div className='header-right'>
  
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
