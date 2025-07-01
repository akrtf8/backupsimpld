// Action to set customers data
export const setCustomers = (customers) => ({
  type: "SET_CUSTOMERS",
  payload: customers,
});

// Action to set rows data
export const setRows = (rows) => ({
  type: "SET_ROWS",
  payload: rows,
});

// Action to set current page
export const setPage = (page) => ({
  type: "SET_PAGE",
  payload: page,
});

// Action to set rows per page
export const setRowsPerPage = (rowsPerPage) => ({
  type: "SET_ROWS_PER_PAGE",
  payload: rowsPerPage,
});

// Action to set loading state
export const setIsLoading = (isLoading) => ({
  type: "SET_IS_LOADING",
  payload: isLoading,
});

// Action to set whether more data is available
export const setHasMoreData = (hasMoreData) => ({
  type: "SET_HAS_MORE_DATA",
  payload: hasMoreData,
});

// Action to set the selected plan
export const setPlan = (plan) => ({
  type: "SET_PLAN",
  payload: plan,
});

// Action to set the plan status
export const setPlanStatus = (planStatus) => ({
  type: "SET_PLAN_STATUS",
  payload: planStatus,
});

export const setDate = (date) => ({
  type: "SET_DATE",
  payload: date,
});

// Action to set the search term
export const setSearchTerm = (searchTerm) => ({
  type: "SET_SEARCH_TERM",
  payload: searchTerm,
});

// Action to set the sort direction
export const setSortDirection = (sortDirection) => ({
  type: "SET_SORT_DIRECTION",
  payload: sortDirection,
});


// Action to set the sort direction
export const setWASortDirection = (sortDirection) => ({
  type: "SET_SORT_WA_DIRECTION",
  payload: sortDirection,
});


// Action to set the sort direction
export const setSMSSortDirection = (sortDirection) => ({
  type: "SET_SORT_SMS_DIRECTION",
  payload: sortDirection,
});

// Action to set the expiry date start
export const setExpiryDateStart = (expiryDateStart) => ({
  type: "SET_EXPIRY_DATE_START",
  payload: expiryDateStart,
});

// Action to set the expiry date end
export const setExpiryDateEnd = (expiryDateEnd) => ({
  type: "SET_EXPIRY_DATE_END",
  payload: expiryDateEnd,
});

// Action to set the city filter
export const setCity = (city) => ({
  type: "SET_CITY",
  payload: city,
});

// Action to set the state filter
export const setFilterState = (filterState) => ({
  type: "SET_FILTER_STATE",
  payload: filterState,
});

// Action to set the variant filter
export const setVariantFilter = (variantFilter) => ({
  type: "SET_VARIANT_FILTER",
  payload: variantFilter,
});

// Action to set the Initial state
export const setInitialLoad = (isInitialLoad) => ({
  type: "SET_INITIAL_LOAD",
  payload: isInitialLoad,
});
