import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressModal = ({ isOpen, onClose, onSave }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const fetchedAddress = await getAddressFromCoords(latitude, longitude);
          setAddress(fetchedAddress);
          localStorage.setItem("userAddress", fetchedAddress); // Save to local storage
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    }
  };

  const getAddressFromCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      return response.data.display_name || "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unable to fetch address";
    }
  };

  const handleSave = () => {
    onSave(address);
    onClose();
  };

  return (
    <div className={`modal fade ${isOpen ? "show d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Delivery Near You</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Fetching location...</p>
            ) : (
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
