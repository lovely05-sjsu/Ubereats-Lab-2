import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5"; // Hamburger and close icons
import { useNavigate } from 'react-router-dom';

const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <IoMenu size={28} />
      </button>

      {/* Overlay when side panel is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg p-6 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2"
          onClick={() => setIsOpen(false)}
        >
          <IoClose size={28} />
        </button>

        {!userEmail && (
          <>
        {/* Sign Up and Login Buttons */}
        <button className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold mb-2"
         onClick={() => navigate('/SignUp')}>
          Sign up
        </button>
        <button className="w-full bg-gray-200 text-black py-3 rounded-md text-lg font-semibold"
        onClick={() => navigate('/Login')}>
          Log in
        </button>
        </>
        )}


          {userEmail && (
          <>
        {/* Sign Up and Login Buttons */}
        <button className="w-full bg-black text-white py-3 rounded-md text-lg font-semibold mb-2"
         onClick={() => navigate('/Favorites')}>
          ❤️ Favorites
        </button>
        <button className="w-full bg-gray-200 text-black py-3 rounded-md text-lg font-semibold"
        onClick={() => navigate('/PastOrders')}>
         🍥 Past Orders
        </button>
        </>
        )}


        {/* Links */}
        <div className="mt-6 space-y-3 text-lg font-medium text-gray-800">
        <p className="cursor-pointer"><a href= "/restaurant/Login">Login to your business account</a></p>          
          <p className="cursor-pointer"><a href= "/restaurant/SignUp">Create a business account</a></p>          
          <p className="cursor-pointer"><a href= "/restaurant/SignUp">Add your restaurant</a></p>
          <p className="cursor-pointer">Sign up to deliver</p>
        </div>

        {/* Uber Eats App Section */}
        <div className="absolute bottom-6 w-full left-0 px-6">
          <div className="flex items-center space-x-2">
            <img src="/images/ubereatslogo.png" alt="Uber Eats" className="w-8 h-8" />
            <p className="text-gray-600">There's more to love in the app.</p>
          </div>

          {/* Download Buttons */}
          <div className="flex space-x-2 mt-3">
            <button className="flex items-center justify-center w-1/2 bg-gray-50 border border-gray-300 py-2 rounded-full">
              <img src="/images/applelogo.png" alt="iPhone" className="w-8 h-5 mr-1" />
              iPhone
            </button>
            <button className="flex items-center justify-center w-1/2 bg-gray-50  border border-gray-300 py-2 rounded-full">
              <img src="/images/androidlogo.png" alt="Android" className="w-5 h-5 mr-2" />
              Android
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
