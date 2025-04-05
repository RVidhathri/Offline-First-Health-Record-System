import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useTheme } from "../ThemeContext";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";
import {
  containerStyle,
  titleStyle,
  labelStyle,
  inputStyle,
  buttonStyle,
} from "../style";

const Profile = () => {
  const { darkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [records, setRecords] = useState([]);
  const [qrData, setQRData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    age: "",
    email: "",
    location: "",
    existingDisease: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Error signing out");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!profileImage) return null;
    
    try {
      setIsUploading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated");
        return null;
      }

      const storageRef = ref(storage, `profile_images/${user.uid}`);
      const snapshot = await uploadBytes(storageRef, profileImage);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => {
    setEditData({
      name: userData.name,
      age: userData.age,
      email: userData.email,
      location: userData.location,
      existingDisease: userData.existingDisease
    });
    setImagePreview(userData.profileImage || null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(userData.profileImage || null);
    setProfileImage(null);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      let imageUrl = userData.profileImage;
      if (profileImage) {
        imageUrl = await uploadImage();
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: editData.name,
        age: editData.age,
        location: editData.location,
        existingDisease: editData.existingDisease,
        profileImage: imageUrl
      });

      setUserData(prev => ({
        ...prev,
        ...editData,
        profileImage: imageUrl
      }));

      setIsEditing(false);
      setProfileImage(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setImagePreview(data.profileImage || null);
          }

          const recordsRef = collection(db, "healthRecords");
          const q = query(recordsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const userRecords = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRecords(userRecords);

          const qrData = {
            profile: {
              name: docSnap.data()?.name,
              age: docSnap.data()?.age,
              email: docSnap.data()?.email,
              location: docSnap.data()?.location,
              existingDisease: docSnap.data()?.existingDisease,
              profileImage: docSnap.data()?.profileImage
            },
            records: userRecords.map(record => ({
              age: record.age,
              date: record.date,
              disease: record.disease,
              hospital: record.hospital,
              doctor: record.doctor,
              file: record.file
            }))
          };
          setQRData(JSON.stringify(qrData));
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load profile data");
        }
      } else {
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={containerStyle(darkMode)}>
      <h2 style={titleStyle(darkMode)}>My Profile</h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          position: 'relative',
          width: '150px',
          height: '150px',
          marginBottom: '1rem'
        }}>
          <img
            src={imagePreview || "/user logo.png"}
            alt="profile"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              border: '3px solid #ffd700'
            }}
          />
          <label style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: '#ffd700',
            padding: '10px',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            transform: 'translate(25%, 25%)',
            transition: 'transform 0.2s ease',
            ':hover': {
              transform: 'translate(25%, 25%) scale(1.1)'
            }
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <span style={{ 
              color: '#000',
              fontSize: '20px',
              display: 'block',
              width: '24px',
              height: '24px',
              lineHeight: '24px',
              textAlign: 'center'
            }}>🪙</span>
          </label>
        </div>
        {isUploading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: darkMode ? '#fff' : '#000'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #ffd700',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Uploading image...</span>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: darkMode ? '#fff' : '#000' }}>Personal Information</h3>
          {!isEditing && (
            <button 
              onClick={handleEdit}
              style={{
                ...buttonStyle(darkMode),
                padding: '8px 16px',
                backgroundColor: '#17a2b8'
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                style={inputStyle(darkMode)}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Age</label>
              <input
                type="number"
                name="age"
                value={editData.age}
                onChange={handleChange}
                style={inputStyle(darkMode)}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                style={inputStyle(darkMode)}
                disabled
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Location</label>
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleChange}
                style={inputStyle(darkMode)}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle(darkMode)}>Existing Disease</label>
              <input
                type="text"
                name="existingDisease"
                value={editData.existingDisease}
                onChange={handleChange}
                style={inputStyle(darkMode)}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleSave}
                style={{
                  ...buttonStyle(darkMode),
                  backgroundColor: '#28a745'
                }}
              >
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
                style={{
                  ...buttonStyle(darkMode),
                  backgroundColor: '#6c757d'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <p style={{ marginBottom: '0.5rem' }}><strong>Name:</strong> {userData.name}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Age:</strong> {userData.age}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {userData.email}</p>
            </div>
            <div>
              <p style={{ marginBottom: '0.5rem' }}><strong>Location:</strong> {userData.location}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Existing Disease:</strong> {userData.existingDisease}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: darkMode ? '#fff' : '#000', marginBottom: '1rem' }}>Health Records QR Code</h3>
        <p style={{ color: darkMode ? '#fff' : '#000', marginBottom: '1rem' }}>
          Scan this QR code to access your health records
        </p>
        <div style={{ 
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          display: 'inline-block',
          marginBottom: '1rem'
        }}>
          {qrData && (
            <QRCodeSVG 
              value={qrData}
              size={256}
              level="H"
              includeMargin={true}
            />
          )}
        </div>
        <p style={{ 
          color: darkMode ? '#fff' : '#000',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          This QR code contains your profile information and all health records. Keep it secure.
        </p>
      </div>

      <button style={buttonStyle(darkMode)} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
