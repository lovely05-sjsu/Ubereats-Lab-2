import React, { useEffect, useState,useContext } from "react";
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
import { CategoryContext } from "./context/CategoryContext";

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

const FoodCategories = ({ onSelectCategory }) => {
  const { setSelectedCategory } = useContext(CategoryContext);

  const handleCategoryClick = (category) => {
      setSelectedCategory(category);
  };

  return (
    <div className="container mt-4">      
      <div className="d-flex overflow-auto" style={{ gap: "15px", whiteSpace: "nowrap" }}>
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`text-center p-3 rounded`}
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
