import React, { useEffect, useState } from "react";
import '../../search.css'
import Contact from '../Contact/Contact';


function BuySell() {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    priceRange: "",
    location: "",
    preApproved: "",
    receiveLists: "",
    beds: "",
    baths: "",
    propertyType: "",
    message: "",
    sellingPrice: "",
    sellingTimeframe: "",
    reasonForSelling: "",
    propertyCondition: "",
    willingToRepair: "",
    alreadyHaveAgent: "",
    contactPermission: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmation(false);
    const endpoint = userType === "buyer" ? "/api/saveBuyer" : "/api/saveSeller";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Your information has been saved!");
        setUserType(""); // Reset form after successful submission
      } else {
        alert("Error saving your information.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="buy-sell-form">
      {!userType ? (
        <div>
          <h2>Are you looking to buy or sell a home?</h2>
          <button onClick={() => setUserType("buyer")}>Buy</button>
          <button onClick={() => setUserType("seller")}>Sell</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>{userType === "buyer" ? "Buyer Information" : "Seller Information"}</h2>

          <button type="button" onClick={() => setUserType("")}>← Back</button>

          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />

          {userType === "buyer" ? (
            <>
              <input type="text" name="priceRange" placeholder="Price Range" onChange={handleChange} required />
              <input type="text" name="location" placeholder="Preferred Location" onChange={handleChange} required />

              <label>Pre-Approved for Mortgage?</label>
              <div>
                <label>
                  <input type="radio" name="preApproved" value="yes" onChange={handleChange} required /> Yes
                </label>
                <label>
                  <input type="radio" name="preApproved" value="no" onChange={handleChange} required /> No
                </label>
              </div>

              <label>Would you like to receive property listings?</label>
              <div>
                <label>
                  <input type="radio" name="receiveLists" value="yes" onChange={handleChange} required /> Yes
                </label>
                <label>
                  <input type="radio" name="receiveLists" value="no" onChange={handleChange} required /> No
                </label>
              </div>

              <input type="number" name="beds" placeholder="Number of Bedrooms" onChange={handleChange} required />
              <input type="number" name="baths" placeholder="Number of Bathrooms" onChange={handleChange} required />

              <label>Property Type:</label>
              <select name="propertyType" onChange={handleChange} required>
                <option value="">Select Property Type</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="apartment">Apartment</option>
                <option value="other">Other</option>
              </select>

              <textarea name="message" placeholder="Additional Comments" onChange={handleChange}></textarea>
            </>
          ) : (
            <>
              <input type="text" name="sellingPrice" placeholder="Expected Selling Price" onChange={handleChange} required />
              <input type="text" name="sellingTimeframe" placeholder="When do you plan to sell?" onChange={handleChange} required />

              <label>Reason for Selling:</label>
              <select name="reasonForSelling" onChange={handleChange} required>
                <option value="">Select Reason</option>
                <option value="relocating">Relocating</option>
                <option value="downsizing">Downsizing</option>
                <option value="upgrading">Upgrading</option>
                <option value="financial">Financial Reasons</option>
                <option value="other">Other</option>
              </select>

              <label>Property Condition:</label>
              <select name="propertyCondition" onChange={handleChange} required>
                <option value="">Select Condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="needs-repairs">Needs Repairs</option>
                <option value="fixer-upper">Fixer Upper</option>
              </select>

              <label>Are you willing to make repairs before selling?</label>
              <div>
                <label>
                  <input type="radio" name="willingToRepair" value="yes" onChange={handleChange} required /> Yes
                </label>
                <label>
                  <input type="radio" name="willingToRepair" value="no" onChange={handleChange} required /> No
                </label>
              </div>

              <label>Do you already have a real estate agent?</label>
              <div>
                <label>
                  <input type="radio" name="alreadyHaveAgent" value="yes" onChange={handleChange} required /> Yes
                </label>
                <label>
                  <input type="radio" name="alreadyHaveAgent" value="no" onChange={handleChange} required /> No
                </label>
              </div>

              <textarea name="message" placeholder="Additional Comments" onChange={handleChange}></textarea>
            </>
          )}

          <label>May we contact you regarding {userType === "buyer" ? "buying" : "selling"} a home?</label>
          <div>
            <label>
              <input type="radio" name="contactPermission" value="yes" onChange={handleChange} required /> Yes
            </label>
            <label>
              <input type="radio" name="contactPermission" value="no" onChange={handleChange} required /> No
            </label>
          </div>

          <button type="submit">Submit</button>
        </form>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <p>
            By submitting this form, you will be added to our {userType} list and may be contacted in the future. Do you wish to proceed?
          </p>
          <button onClick={confirmSubmission}>Yes, Submit</button>
          <button onClick={() => setShowConfirmation(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default BuySell;
