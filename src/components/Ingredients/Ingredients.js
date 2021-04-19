import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from './Search';
import useHttp from "../../hooks/http";

const ingredReducer = (currentIngredients, action) => {
  switch(action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(ingredient => ingredient.id !== action.id);
      default: throw new Error("Should not get there!");
  }
};

const Ingredients = () => {

  const [stateIngredients, dispatch] = useReducer(ingredReducer, []);
  
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();

  useEffect(() => {
    if (!isLoading && reqIdentifier === "REMOVE_ING") {
      dispatch({type: "DELETE", id: reqExtra});
    } else if (!isLoading && !error && reqIdentifier === "ADD_ING") {
      dispatch({type: "ADD", ingredient: {id: data.name, ...reqExtra}});
    }
    
  }, [data, reqExtra, reqIdentifier, isLoading, error]); // With [] as a second argument useEffect atcs like componentDidMount
  // It runs only once (after the first render)


  const addIngredientHandler = useCallback(async (ingredient) => {

    const reqData = {
      ...ingredient,
    };

    sendRequest(
      "https://react-hooks-example-cf70a-default-rtdb.firebaseio.com/ingredients.json",
      "POST",
      reqData,
      ingredient,
      "ADD_ING",
    );

	}, [sendRequest]);

  const fileteredInngredientsHandler = useCallback((filterIngs) => {  
    dispatch({type: "SET", ingredients: filterIngs});
  }, []);

  const onRemoveIngredients = useCallback((id) => {
    sendRequest(`https://react-hooks-example-cf70a-default-rtdb.firebaseio.com/ingredients/${id}.json`, 
    "DELETE",
    null,
    id,
    "REMOVE_ING",
  );
  }, [sendRequest]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={stateIngredients} 
        onRemoveItem={onRemoveIngredients}
      />
    );
  }, [stateIngredients, onRemoveIngredients]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading}/>

      <section>
        <Search onFetchIngredients={fileteredInngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
