// Consider renaming or removing this file to avoid conflicts with src/pages/FoodCategories.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../redux/slices/categorySlice'; // Import setSelectedCategory

const FoodCategories = () => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.category.categories);
    const selectedCategory = useSelector(state => state.category.selectedCategory);

    const handleCategorySelect = (categoryId) => {
        dispatch(setSelectedCategory(categoryId)); // Use setSelectedCategory to update selectedCategory
    };

    return (
        <div className="food-categories">
            <h2>Food Categories</h2>
            <ul>
                {categories.map(category => (
                    <li
                        key={category.id}
                        className={selectedCategory === category.id ? 'selected' : ''}
                        onClick={() => handleCategorySelect(category.id)}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FoodCategories;
