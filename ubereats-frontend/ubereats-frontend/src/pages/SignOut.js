import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear all data from local storage
    localStorage.clear();
    
    // Redirect user to the login page after a short delay
    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 1000);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-xl font-semibold">Signing out...</h2>
    </div>
  );
};

export default SignOut;
