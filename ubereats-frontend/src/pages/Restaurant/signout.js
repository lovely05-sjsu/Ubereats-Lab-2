import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantSignOut = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear all data from local storage
    localStorage.clear();
    
    // Redirect user to the restaurant login page directly
    navigate("/restaurant/login", { replace: true });  // ✅ no window.location.reload
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-xl font-semibold">Signing out...</h2>
    </div>
  );
};

export default RestaurantSignOut;
