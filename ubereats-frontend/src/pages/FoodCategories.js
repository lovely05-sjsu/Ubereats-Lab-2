import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPizzaSlice,
  faHamburger,
  faFish,
  faAppleAlt,
  faBowlFood,
  faDrumstickBite,
  faIceCream,
  faMugHot,
  faCarrot,
  faBacon,
  faBurger,
  faStroopwafel,
  faUtensils
} from "@fortawesome/free-solid-svg-icons";
import { setSelectedCategory } from "../redux/slices/categorySlice"; // Import Redux action

const categories = [
  { name: "All", icon: faUtensils },
  { name: "Pizza", icon: faPizzaSlice },
  { name: "Fast Food", icon: faHamburger },
  { name: "Seafood", icon: faFish },
  { name: "Healthy", icon: faAppleAlt },
  { name: "Mexican", icon: faCarrot },
  { name: "Asian", icon: faBowlFood },
  { name: "Italian", icon: faBacon },
  { name: "BBQ", icon: faBurger },
  { name: "Chicken", icon: faDrumstickBite },
  { name: "Pancake", icon: faStroopwafel },
  { name: "Desserts", icon: faIceCream },
  { name: "Beverages", icon: faMugHot }
];

const FoodCategories = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.selectedCategory); // Access selectedCategory from Redux

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category)); // Dispatch action to update selectedCategory
  };

  return (
    <div className="container mt-4">
      <div className="d-flex overflow-auto" style={{ gap: "15px", whiteSpace: "nowrap" }}>
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`text-center p-3 rounded ${selectedCategory === cat.name ? "selected" : ""}`}
            style={{ cursor: "pointer", minWidth: "100px" }}
            onClick={() => handleCategoryClick(cat.name)}
          >
            <FontAwesomeIcon icon={cat.icon} size="2x" />
            <p className="mt-2 mb-0">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategories;
