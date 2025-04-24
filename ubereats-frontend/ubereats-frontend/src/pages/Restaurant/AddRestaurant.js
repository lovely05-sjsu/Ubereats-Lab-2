import React, { useState } from "react";

const AddRestaurant = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: "",
        description: ""
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null); // ✅ Image Preview

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // ✅ Show preview before upload
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.location || !formData.description || !image) {
            alert("❌ All fields are required!");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("image", image);

        try {
            const response = await fetch("http://localhost:2000/api/restaurants", {
                method: "POST",
                body: formDataToSend
            });

            const data = await response.json();
            if (!response.ok) {
                alert(`❌ Error: ${data.error}`);
                return;
            }

            alert("✅ Restaurant added successfully!");
            setFormData({ name: "", email: "", location: "", description: "" });
            setImage(null);
            setPreview(null);
        } catch (error) {
            console.error("❌ Error adding restaurant:", error);
            alert("An error occurred");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Add Restaurant</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
                        <div className="mb-3">
                            <label className="form-label">Restaurant Name</label>
                            <input type="text" name="name" className="form-control" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" className="form-control" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input type="text" name="location" className="form-control" placeholder="Enter location" value={formData.location} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control" placeholder="Enter description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Upload Image</label>
                            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" required />
                        </div>

                        {/* ✅ Image Preview */}
                        {preview && (
                            <div className="mb-3 text-center">
                                <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100">Add Restaurant</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRestaurant;
