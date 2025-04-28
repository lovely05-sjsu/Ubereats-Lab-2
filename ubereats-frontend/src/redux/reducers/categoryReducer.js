const initialState = {
    selectedCategory: "All",
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CATEGORY':
            return {
                ...state,
                selectedCategory: action.payload,
            };
        default:
            return state;
    }
};

export default categoryReducer;
