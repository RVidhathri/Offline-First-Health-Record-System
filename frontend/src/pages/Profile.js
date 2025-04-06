import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useTheme } from "../ThemeContext";
import { toast } from "react-toastify";
import { useAuth } from '../AuthContext';
import styled from 'styled-components';
import { styles } from "../style";

const PageContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 2rem;
`;

const ContentGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
`;

const Card = styled.div`
    background-color: ${props => props.darkMode ? 'rgba(33, 33, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid ${props => props.darkMode ? '#444' : '#eee'};
`;

const ProfileImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${props => props.darkMode ? '#444' : '#fff'};
`;

const ProfileInfo = styled.div`
    flex-grow: 1;
`;

const Username = styled.h1`
    color: ${props => props.darkMode ? '#fff' : '#333'};
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
`;

const Email = styled.p`
    color: ${props => props.darkMode ? '#aaa' : '#666'};
    margin: 0;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    background-color: ${props => props.$variant === 'primary' ? '#007bff' : 
                                props.$variant === 'danger' ? '#dc3545' : '#6c757d'};
    color: white;
    &:hover {
        opacity: 0.9;
    }
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
`;

const InfoSection = styled.div`
    margin-bottom: 1.5rem;
`;

const Label = styled.h3`
    color: ${props => props.darkMode ? '#ddd' : '#666'};
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
`;

const Value = styled.p`
    color: ${props => props.darkMode ? '#fff' : '#333'};
    font-size: 1.1rem;
    margin: 0;
`;

const QRSection = styled.div`
    text-align: center;

    h2 {
        color: ${props => props.darkMode ? '#fff' : '#333'};
        font-size: 1.4rem;
        margin-bottom: 1.5rem;
    }

    p {
        color: ${props => props.darkMode ? '#aaa' : '#666'};
        font-size: 0.9rem;
        margin: 1rem 0;
    }
`;

const QRCodeContainer = styled.div`
    background: white;
    padding: 1rem;
    border-radius: 10px;
    display: inline-block;
    margin: 1rem 0;
`;

const Profile = () => {
    const { darkMode } = useTheme();
    const currentStyles = styles(darkMode);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        bloodGroup: "",
        emergencyContact: "",
        existingConditions: ""
    });
    const navigate = useNavigate();
    const { currentUser: user } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData({ ...data, uid: user.uid });
                        setImagePreview(data.profileImageUrl || "/user logo.png");
                        setEditData({
                            name: data.name || "",
                            age: data.age || "",
                            email: user.email || "",
                            phone: data.phone || "",
                            address: data.address || "",
                            bloodGroup: data.bloodGroup || "",
                            emergencyContact: data.emergencyContact || "",
                            existingConditions: data.existingConditions || ""
                        });
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    toast.error("Failed to load profile data");
                    setLoading(false);
                }
            } else {
                navigate("/login");
            }
        };
        fetchUserData();
    }, [navigate, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadProfileImage = async () => {
        if (!profileImage) return null;
        try {
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            const snapshot = await uploadBytes(storageRef, profileImage);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload profile image");
            return null;
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Error signing out");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            if (!user) {
                toast.error("Please login to update profile");
                return;
            }

            let profileImageUrl = userData?.profileImageUrl;
            if (profileImage) {
                const uploadedUrl = await uploadProfileImage();
                if (uploadedUrl) {
                    profileImageUrl = uploadedUrl;
                }
            }

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                ...editData,
                profileImageUrl,
                updatedAt: new Date().toISOString()
            });

            setUserData(prev => ({
                ...prev,
                ...editData,
                profileImageUrl
            }));
            setIsEditing(false);
            setProfileImage(null);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const generateQRCodeData = () => {
        if (!userData) return "";
        return `https://secret-cipher-453016-s5.web.app/public-record/${userData.uid}`;
    };

    const generateQRCodeUrl = () => {
        const data = encodeURIComponent(generateQRCodeData());
        return `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=200x200`;
    };

    if (loading) {
        return (
            <PageContainer>
                <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                    <p style={{ color: darkMode ? '#fff' : '#333' }}>Loading...</p>
            </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentGrid>
                <Card darkMode={darkMode}>
                    <ProfileHeader darkMode={darkMode}>
                        <ProfileImage 
                                    src={imagePreview}
                                    alt="Profile"
                            darkMode={darkMode}
                        />
                        <ProfileInfo>
                            <Username darkMode={darkMode}>{userData?.name || user.email.split('@')[0]}</Username>
                            <Email darkMode={darkMode}>{user.email}</Email>
                        </ProfileInfo>
                        <Button $variant="primary" onClick={() => setIsEditing(true)}>
                                Edit Profile
                        </Button>
                    </ProfileHeader>

                    {isEditing ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: darkMode ? '#ddd' : '#666'
                                    }}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleInputChange}
                                        style={{
                                            ...currentStyles.input,
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: darkMode ? '#ddd' : '#666'
                                    }}>Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={editData.age}
                                        onChange={handleInputChange}
                                        style={{
                                            ...currentStyles.input,
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: darkMode ? '#ddd' : '#666'
                                    }}>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editData.phone}
                                        onChange={handleInputChange}
                                        style={{
                                            ...currentStyles.input,
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        color: darkMode ? '#ddd' : '#666'
                                    }}>Blood Group</label>
                                    <input
                                        type="text"
                                        name="bloodGroup"
                                        value={editData.bloodGroup}
                                        onChange={handleInputChange}
                                        style={{
                                            ...currentStyles.input,
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: darkMode ? '#ddd' : '#666'
                                }}>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={editData.address}
                                    onChange={handleInputChange}
                                    style={{
                                        ...currentStyles.input,
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: darkMode ? '#ddd' : '#666'
                                }}>Emergency Contact</label>
                                <input
                                    type="text"
                                    name="emergencyContact"
                                    value={editData.emergencyContact}
                                    onChange={handleInputChange}
                                    style={{
                                        ...currentStyles.input,
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: darkMode ? '#ddd' : '#666'
                                }}>Existing Medical Conditions</label>
                                <textarea
                                    name="existingConditions"
                                    value={editData.existingConditions}
                                    onChange={handleInputChange}
                                    style={{
                                        ...currentStyles.input,
                                        width: '100%',
                                        minHeight: '100px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                marginTop: '1rem'
                            }}>
                                <Button $variant="primary" onClick={handleSave}>
                                    Save Changes
                                </Button>
                                <Button $variant="danger" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <InfoGrid>
                            <InfoSection>
                                <Label darkMode={darkMode}>Age</Label>
                                <Value darkMode={darkMode}>{userData?.age || 'Not specified'}</Value>
                            </InfoSection>
                            <InfoSection>
                                <Label darkMode={darkMode}>Blood Group</Label>
                                <Value darkMode={darkMode}>{userData?.bloodGroup || 'Not specified'}</Value>
                            </InfoSection>
                            <InfoSection>
                                <Label darkMode={darkMode}>Phone</Label>
                                <Value darkMode={darkMode}>{userData?.phone || 'Not specified'}</Value>
                            </InfoSection>
                            <InfoSection>
                                <Label darkMode={darkMode}>Emergency Contact</Label>
                                <Value darkMode={darkMode}>{userData?.emergencyContact || 'Not specified'}</Value>
                            </InfoSection>
                        </InfoGrid>
                    )}

                    <InfoSection>
                        <Label darkMode={darkMode}>Address</Label>
                        <Value darkMode={darkMode}>{userData?.address || 'Not specified'}</Value>
                    </InfoSection>

                    <InfoSection>
                        <Label darkMode={darkMode}>Existing Medical Conditions</Label>
                        <Value darkMode={darkMode}>{userData?.existingConditions || 'None'}</Value>
                    </InfoSection>
                </Card>

                <Card darkMode={darkMode}>
                    <QRSection darkMode={darkMode}>
                        <h2>Medical History Access</h2>
                        <QRCodeContainer>
                            <img 
                                src={generateQRCodeUrl()} 
                                alt="Medical QR Code"
                                width="200"
                                height="200"
                            />
                        </QRCodeContainer>
                        <p>
                            Scan this QR code to view your complete medical history. 
                            Only authorized healthcare providers can access this information.
                        </p>
                        <Button $variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </QRSection>
                </Card>
            </ContentGrid>
        </PageContainer>
    );
};

export default Profile;
