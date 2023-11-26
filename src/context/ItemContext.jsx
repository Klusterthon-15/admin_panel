import { createContext, useReducer } from "react";

export const ItemsContext = createContext();

const initialState = {
  patientId: null,
};

const itemsReducer = (state, action) => {
  switch (action.type) {
    case
 
'SET_SELECTED_PATIENT':
      return {
        ...state,
        patientId: action.payload,
      };
    case
 
'CLEAR_SELECTED_PATIENT':
      return {
        ...state,
        patientId: null,
      };
    default:
      return state;
  }
};

export const ItemsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(itemsReducer, initialState);
  
    return (
      <ItemsContext.Provider value={{ ...state, dispatch }}>
        {children}
      </ItemsContext.Provider>
    );
  };
  
  export
   
  default ItemsContextProvider;