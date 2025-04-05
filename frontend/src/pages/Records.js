import React, { useState, useEffect } from "react";
import { styles } from "../style";
import { useTheme } from "../ThemeContext";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import {
    containerStyle,
    titleStyle,
    descriptionStyle,
    labelStyle,
    inputStyle,
    buttonStyle,
} from "../style";

const Records = () => {
    const { darkMode } = useTheme();
    const currentStyles = styles(darkMode);

    const [records, setRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({
        age: "",
        date: "",
        disease: "",
        hospital: "",
        doctor: "",
        file: null,
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrData, setQRData] = useState(null);
    const recordsPerPage = 10;

    // Load records from localStorage first
    useEffect(() => {
        const loadRecords = () => {
            try {
                const storedRecords = localStorage.getItem("healthRecords");
                if (storedRecords) {
                    const parsedRecords = JSON.parse(storedRecords);
                    setRecords(parsedRecords);
                }
            } catch (error) {
                console.error("Error loading records from localStorage:", error);
            }
        };

        loadRecords();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recordToSave = {
                ...newRecord,
                createdAt: new Date().toISOString()
            };

            // Add to local state first
            const updatedRecord = {
                id: Date.now().toString(), // Temporary ID for offline use
                ...recordToSave
            };
            
            // Update state immediately
            setRecords(prev => {
                const newRecords = [...prev, updatedRecord];
                // Save to localStorage
                localStorage.setItem("healthRecords", JSON.stringify(newRecords));
                return newRecords;
            });
            
            // Clear form
            setNewRecord({ age: "", date: "", disease: "", hospital: "", doctor: "", file: null });
            
            // If user is logged in, try to save to Firestore
            const user = auth.currentUser;
            if (user) {
                try {
                    const recordsRef = collection(db, "healthRecords");
                    const docRef = await addDoc(recordsRef, {
                        ...recordToSave,
                        userId: user.uid
                    });
                    
                    // Update the record with the Firestore ID
                    setRecords(prev => {
                        const updatedRecords = prev.map(record => 
                            record.id === updatedRecord.id 
                                ? { ...record, id: docRef.id }
                                : record
                        );
                        localStorage.setItem("healthRecords", JSON.stringify(updatedRecords));
                        return updatedRecords;
                    });
                    
                    toast.success("Record added successfully");
                } catch (error) {
                    console.error("Error saving to Firestore:", error);
                    toast.warning("Record saved locally, but failed to sync with cloud");
                }
            } else {
                toast.success("Record saved locally");
            }
        } catch (error) {
            console.error("Error adding record:", error);
            toast.error("Failed to add record");
        }
    };

    const handleDelete = async (index, recordId) => {
        try {
            // Remove from local state first
            setRecords(prev => {
                const newRecords = prev.filter((_, i) => i !== index);
                localStorage.setItem("healthRecords", JSON.stringify(newRecords));
                return newRecords;
            });

            // If user is logged in and record has a Firestore ID, try to delete from Firestore
            const user = auth.currentUser;
            if (user && recordId && !recordId.startsWith('temp_')) {
                try {
                    await deleteDoc(doc(db, "healthRecords", recordId));
                    toast.success("Record deleted successfully");
                } catch (error) {
                    console.error("Error deleting from Firestore:", error);
                    toast.warning("Record deleted locally, but failed to sync with cloud");
                }
            } else {
                toast.success("Record deleted locally");
            }
        } catch (error) {
            console.error("Error deleting record:", error);
            toast.error("Failed to delete record");
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setNewRecord({ ...newRecord, file: files[0]?.name || null });
        } else {
            setNewRecord({ ...newRecord, [name]: value });
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedRecords = React.useMemo(() => {
        let sortableRecords = [...records];
        if (sortConfig.key) {
            sortableRecords.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableRecords;
    }, [records, sortConfig]);

    const handleExport = () => {
        const dataStr = JSON.stringify(records, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'health-records.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const generateQRCode = () => {
        try {
            // Create a data object with user's records
            const userData = {
                userId: auth.currentUser?.uid,
                records: records.map(record => ({
                    age: record.age,
                    date: record.date,
                    disease: record.disease,
                    hospital: record.hospital,
                    doctor: record.doctor,
                    file: record.file
                }))
            };

            // Convert to JSON string
            const dataString = JSON.stringify(userData);
            setQRData(dataString);
            setShowQRCode(true);
        } catch (error) {
            console.error("Error generating QR code:", error);
            toast.error("Failed to generate QR code");
        }
    };

    const filteredRecords = sortedRecords.filter(record => {
        const matchesSearch = Object.values(record).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const matchesDateRange = (!dateRange.start || record.date >= dateRange.start) && 
                               (!dateRange.end || record.date <= dateRange.end);
        
        return matchesSearch && matchesDateRange;
    });

    // Pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    };

    const thStyle = {
        padding: '12px',
        textAlign: 'left',
        backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
        cursor: 'pointer',
        borderBottom: `2px solid ${darkMode ? '#444' : '#ddd'}`,
    };

    const tdStyle = {
        padding: '12px',
        borderBottom: `1px solid ${darkMode ? '#444' : '#ddd'}`,
    };

    const trHoverStyle = {
        backgroundColor: darkMode ? '#3d3d3d' : '#f9f9f9',
    };

    const RecordModal = ({ record, onClose }) => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                padding: '2rem',
                borderRadius: '10px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h3 style={{ color: darkMode ? '#fff' : '#000', marginBottom: '1rem' }}>Record Details</h3>
                <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Date:</strong> {record.date}</p>
                    <p><strong>Age:</strong> {record.age}</p>
                    <p><strong>Disease:</strong> {record.disease}</p>
                    <p><strong>Hospital:</strong> {record.hospital}</p>
                    <p><strong>Doctor:</strong> {record.doctor}</p>
                    <p><strong>File:</strong> {record.file || "None"}</p>
                </div>
                <button 
                    onClick={onClose}
                    style={{
                        ...buttonStyle(darkMode),
                        backgroundColor: '#6c757d',
                        marginTop: '1rem'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );

    return (
        <div style={containerStyle(darkMode)}>
            <h2 style={titleStyle(darkMode)}>Health Records</h2>
            
            {loading && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <p style={{ color: darkMode ? '#fff' : '#000' }}>Loading records...</p>
                </div>
            )}

            {/* Summary Section */}
            <div style={{
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h3 style={{ color: darkMode ? '#fff' : '#000', margin: 0 }}>Total Records: {records.length}</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={handleExport}
                        style={{
                            ...buttonStyle(darkMode),
                            backgroundColor: '#28a745'
                        }}
                    >
                        Export Records
                    </button>
                    <button 
                        onClick={generateQRCode}
                        style={{
                            ...buttonStyle(darkMode),
                            backgroundColor: '#17a2b8'
                        }}
                    >
                        Generate QR Code
                    </button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div style={{
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem'
            }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            ...inputStyle(darkMode),
                            flex: '1',
                            minWidth: '200px'
                        }}
                    />
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        style={inputStyle(darkMode)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        style={inputStyle(darkMode)}
                        placeholder="End Date"
                    />
                </div>
            </div>

            {/* Form Section */}
            <div style={{
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    color: darkMode ? '#fff' : '#000',
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem'
                }}>Add New Health Record</h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div>
                            <label style={{
                                ...labelStyle(darkMode),
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '1.1rem'
                            }}>Age</label>
                            <input 
                                name="age" 
                                placeholder="Enter age" 
                                value={newRecord.age} 
                                onChange={handleChange} 
                                required 
                                style={{
                                    ...inputStyle(darkMode),
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }} 
                            />
                        </div>
                        
                        <div>
                            <label style={{
                                ...labelStyle(darkMode),
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '1.1rem'
                            }}>Date</label>
                            <input 
                                name="date" 
                                type="date" 
                                value={newRecord.date} 
                                onChange={handleChange} 
                                required 
                                style={{
                                    ...inputStyle(darkMode),
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }} 
                            />
                        </div>
                        
                        <div>
                            <label style={{
                                ...labelStyle(darkMode),
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '1.1rem'
                            }}>Diagnosed Disease</label>
                            <input 
                                name="disease" 
                                placeholder="Enter disease name" 
                                value={newRecord.disease} 
                                onChange={handleChange} 
                                required 
                                style={{
                                    ...inputStyle(darkMode),
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }} 
                            />
                        </div>
                        
                        <div>
                            <label style={{
                                ...labelStyle(darkMode),
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '1.1rem'
                            }}>Hospital Name</label>
                            <input 
                                name="hospital" 
                                placeholder="Enter hospital name" 
                                value={newRecord.hospital} 
                                onChange={handleChange} 
                                required 
                                style={{
                                    ...inputStyle(darkMode),
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }} 
                            />
                        </div>
                        
                        <div>
                            <label style={{
                                ...labelStyle(darkMode),
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '1.1rem'
                            }}>Doctor Name</label>
                            <input 
                                name="doctor" 
                                placeholder="Enter doctor name" 
                                value={newRecord.doctor} 
                                onChange={handleChange} 
                                required 
                                style={{
                                    ...inputStyle(darkMode),
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }} 
                            />
                        </div>
                        
                        <div>
                            <label style={{
                                ...labelStyle(darkMode),
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '1.1rem'
                            }}>Attach File</label>
                            <input 
                                type="file" 
                                name="file" 
                                onChange={handleChange} 
                                style={{
                                    ...inputStyle(darkMode),
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }} 
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        style={{ 
                            ...buttonStyle(darkMode),
                            padding: '12px 24px',
                            fontSize: '1.1rem',
                            width: '200px',
                            margin: '0 auto',
                            display: 'block'
                        }}
                    >
                        Add Record
                    </button>
                </form>
            </div>

            {/* Records Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle} onClick={() => handleSort('date')}>
                                Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th style={thStyle} onClick={() => handleSort('age')}>
                                Age {sortConfig.key === 'age' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th style={thStyle} onClick={() => handleSort('disease')}>
                                Disease {sortConfig.key === 'disease' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th style={thStyle} onClick={() => handleSort('hospital')}>
                                Hospital {sortConfig.key === 'hospital' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th style={thStyle} onClick={() => handleSort('doctor')}>
                                Doctor {sortConfig.key === 'doctor' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th style={thStyle}>File</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            currentRecords.map((record, index) => (
                                <tr key={record.id || index} style={trHoverStyle}>
                                    <td style={tdStyle}>{record.date}</td>
                                    <td style={tdStyle}>{record.age}</td>
                                    <td style={tdStyle}>{record.disease}</td>
                                    <td style={tdStyle}>{record.hospital}</td>
                                    <td style={tdStyle}>{record.doctor}</td>
                                    <td style={tdStyle}>{record.file || "None"}</td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => {
                                                    setSelectedRecord(record);
                                                    setShowModal(true);
                                                }}
                                                style={{
                                                    ...buttonStyle(darkMode),
                                                    padding: '5px 10px',
                                                    backgroundColor: '#17a2b8'
                                                }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(index, record.id)}
                                                style={{
                                                    ...buttonStyle(darkMode),
                                                    padding: '5px 10px',
                                                    backgroundColor: '#dc3545'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={buttonStyle(darkMode)}
                    >
                        Previous
                    </button>
                    <span style={{ color: darkMode ? '#fff' : '#000' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={buttonStyle(darkMode)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Record Details Modal */}
            {showModal && selectedRecord && (
                <RecordModal 
                    record={selectedRecord} 
                    onClose={() => {
                        setShowModal(false);
                        setSelectedRecord(null);
                    }} 
                />
            )}

            {/* QR Code Modal */}
            {showQRCode && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                        padding: '2rem',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: darkMode ? '#fff' : '#000', marginBottom: '1rem' }}>
                            Scan this QR code to access your records
                        </h3>
                        <div style={{ 
                            padding: '1rem',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            <QRCodeSVG 
                                value={qrData}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <p style={{ 
                            color: darkMode ? '#fff' : '#000',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            This QR code contains all your health records. Keep it secure.
                        </p>
                        <button 
                            onClick={() => setShowQRCode(false)}
                            style={{
                                ...buttonStyle(darkMode),
                                backgroundColor: '#6c757d'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Records;
