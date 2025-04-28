const initialState = {
    id: null,
};

const restaurantReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SELECTED_RESTAURANT_ID':
            return {
                ...state,
                id: action.payload,
            };
        default:
            return state;
    }
};

export default restaurantReducer;