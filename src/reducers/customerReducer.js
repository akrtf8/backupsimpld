// src/reducers/customerReducer.js

const initialState = {
  customers: [],
  rows: [],
  page: 1,
  rowsPerPage: 250,
  isLoading: false,
  hasMoreData: true,
  plan: "",
  planStatus: "",
  searchTerm: "",
  sortDirection: "",
  sortWADirection: "",
  sortSMSDirection: "",
  expiryDateStart: null,
  expiryDateEnd: null,
  city: "",
  filterState: "",
  variantFilter: "",
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CUSTOMERS":
      return { ...state, customers: action.payload };
    case "SET_ROWS":
      return { ...state, rows: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_ROWS_PER_PAGE":
      return { ...state, rowsPerPage: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_HAS_MORE_DATA":
      return { ...state, hasMoreData: action.payload };
    case "SET_PLAN":
      return { ...state, plan: action.payload };
    case "SET_PLAN_STATUS":
      return { ...state, planStatus: action.payload };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SORT_DIRECTION":
      return { ...state, sortDirection: action.payload };
    case "SET_SORT_WA_DIRECTION":
      return { ...state, sortWADirection: action.payload };
    case "SET_SORT_SMS_DIRECTION":
      return { ...state, sortSMSDirection: action.payload };
    case "SET_EXPIRY_DATE_START":
      return { ...state, expiryDateStart: action.payload };
    case "SET_EXPIRY_DATE_END":
      return { ...state, expiryDateEnd: action.payload };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_FILTER_STATE":
      return { ...state, filterState: action.payload };
    case "SET_VARIANT_FILTER":
      return { ...state, variantFilter: action.payload };
    case "SET_INITIAL_LOAD":
      return { ...state, isInitialLoad: action.payload };
    default:
      return state;
  }
};

export default customerReducer;
