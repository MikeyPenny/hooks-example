import { useReducer, useCallback } from "react";
import axios from "axios";

const initialState = {
    loading: false, 
    error: null,
    data: null,
    extra: null,
    identifier: null,
};

const httpReducer = (currHttpState, action) => {
    switch(action.type) {
      case "SEND":
        return {
            loading: true, 
            error: null, 
            data: null, 
            extra: null, 
            identifier: action.identifier,
        };
      case "RESPONSE":
        return {...currHttpState, loading: false, error: null, data: action.responseData, extra: action.extra};
      case "ERROR":
        return {loading: false, error: action.errorMessage}
      case "CLEAR":
        return initialState;
      default: throw new Error("Should not be reached");
    }
  };

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({type: "CLEAR"}), []);

    const sendRequest = useCallback(async (url, method, data, reqExtra, reqIdentifier) => {
        dispatchHttp({type: "SEND", identifier: reqIdentifier});
        try {
            const response = await axios({
                url: url,
                method: method,
                data: data,
            });
            dispatchHttp({type: "RESPONSE", responseData: response.data, extra: reqExtra});

        } catch (err) {
            dispatchHttp({type: "ERROR", errorMessage: err.message});
        }
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear,
    };
};

export default useHttp;