import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  containerStyle,
  titleStyle,
  descriptionStyle,
  labelStyle,
  inputStyle,
  buttonStyle,
} from "../style";

const Register = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    location: "",
    existingDisease: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${user.uid}&size=150x150`;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        location: formData.location,
        existingDisease: formData.existingDisease,
        qrCode: qrCodeUrl,
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div style={containerStyle(darkMode)}>
      <div style={titleStyle(darkMode)}>Register Now</div>
      <div style={descriptionStyle(darkMode)}>
        Create your account to securely store and manage your health records
        anytime, anywhere, even offline.
      </div>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle(darkMode)}>Name</label>
        <input
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
          value={formData.name}
          style={inputStyle(darkMode)}
          required
        />

        <label style={labelStyle(darkMode)}>Age</label>
        <input
          name="age"
          type="number"
          placeholder="Enter your age"
          onChange={handleChange}
          value={formData.age}
          style={inputStyle(darkMode)}
          required
        />

        <label style={labelStyle(darkMode)}>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange}
          value={formData.email}
          style={inputStyle(darkMode)}
          required
        />

        <label style={labelStyle(darkMode)}>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
          value={formData.password}
          style={inputStyle(darkMode)}
          required
        />

        <label style={labelStyle(darkMode)}>Location</label>
        <input
          name="location"
          placeholder="Enter your location"
          onChange={handleChange}
          value={formData.location}
          style={inputStyle(darkMode)}
          required
        />

        <label style={labelStyle(darkMode)}>Existing Disease</label>
        <input
          name="existingDisease"
          placeholder="Enter any existing disease"
          onChange={handleChange}
          value={formData.existingDisease}
          style={inputStyle(darkMode)}
          required
        />

        <button type="submit" style={buttonStyle(darkMode)}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
