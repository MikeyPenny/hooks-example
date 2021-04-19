import React, { useState, useEffect, useRef } from 'react';

import useHttp from "../../hooks/http";

import ErrorModal from "../UI/ErrorModal";
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const {onFetchIngredients} = props;
  const [filter, setFilter] = useState("");
  const {isLoading, data, error, sendRequest, clear} = useHttp();

  const inputRef = useRef();

  useEffect(() => {

    const timer = setTimeout(() => {
      if(filter === inputRef.current.value) {
        
        const query = filter.length === 0 ? "" : `?orderBy="title"&equalTo="${filter}"`;  
        sendRequest(
          "https://react-hooks-example-cf70a-default-rtdb.firebaseio.com/ingredients.json" + query,
          "GET",
        );
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };

  }, [filter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngs = [];
            
      for (const key in data) {
        loadedIngs.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        })
      }
      onFetchIngredients(loadedIngs);
    }
  }, [data, isLoading, error, onFetchIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input ref={inputRef} type="text" value={filter} 
          onChange={(e) => setFilter(e.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
