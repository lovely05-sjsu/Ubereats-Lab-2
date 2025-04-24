import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
        <div className="flex flex-col items-start justify-normal w-full md:w-2/3">

          <h1 className="text-4xl font-bold">Uber <span className="font-extrabold">Eats</span></h1>
          
          <div className="flex space-x-4 mt-28">
            {/* App Store Button */}
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on the App Store" 
                className="w-44 h-14"
              />
            </a>

            {/* Google Play Button */}
            <a href="#" className="cursor-pointer">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Google Play Store" 
                className="w-44 h-14" 
              />
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-around gap-8 w-full md:w-2/3">
          <div className="space-y-2">
            <p>Get Help</p>
            <p>Buy gift cards</p>
            <p>Add your restaurant</p>
            <p>Sign up to deliver</p>
            <p>Create a business account</p>
          </div>
          <div className="space-y-2">
            <p>Restaurants near me</p>
            <p>View all cities</p>
            <p>View all countries</p>
            <p>Pickup near me</p>
            <p>About Uber Eats</p>
            <p>Shop groceries</p>
            <p className="font-semibold">🌐 English</p>
          </div>         
        </div>
      </div>

      <div className="mt-8 border-t pt-4 flex items-center justify-between text-sm text-gray-600">
        {/* Social Media Icons - Left side */}
        <div className="flex space-x-4 text-xl mt-">
          <FaFacebookF className="cursor-pointer" />
          <FaTwitter className="cursor-pointer" />
          <FaInstagram className="cursor-pointer" />
        </div>

        {/* Privacy, Terms, etc. - Right side */}
        <div className="flex space-x-4">
          <p>Privacy Policy</p>
          <p>Terms</p>
          <p>Pricing</p>
          <p>Do not sell or share my personal information</p>
        </div>
      </div>

      {/* Bottom-right copyright */}
      <div className="mt-2 text-sm text-gray-600 text-right">
        <p>© 2025 Uber Technologies Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
