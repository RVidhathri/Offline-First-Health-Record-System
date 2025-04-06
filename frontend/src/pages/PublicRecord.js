import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTheme } from '../ThemeContext';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

const PublicRecord = () => {
    const { id } = useParams();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                setError(null);

                // Query records for the specific user ID
                const recordsRef = collection(db, 'records');
                const q = query(recordsRef, where('userId', '==', id));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('No health records found for this user.');
                    return;
                }

                const fetchedRecords = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setRecords(fetchedRecords);
            } catch (error) {
                console.error('Error fetching records:', error);
                setError('Failed to load health records. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecords();
        }
    }, [id]);

    const downloadAsExcel = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(
                records.map(record => ({
                    Date: new Date(record.date).toLocaleDateString(),
                    Age: record.age,
                    Disease: record.disease,
                    Hospital: record.hospital,
                    Doctor: record.doctor,
                    'File Name': record.fileName || 'No file attached',
                    'File Type': record.file ? (record.file.startsWith('data:') ? record.file.split(':')[1].split(';')[0] : 'URL') : 'No file'
                }))
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Health Records');
            
            // Set column widths
            const colWidths = [
                { wch: 12 }, // Date
                { wch: 8 },  // Age
                { wch: 20 }, // Disease
                { wch: 20 }, // Hospital
                { wch: 20 }, // Doctor
                { wch: 20 }, // File Name
                { wch: 15 }  // File Type
            ];
            worksheet['!cols'] = colWidths;

            XLSX.writeFile(workbook, 'health_records.xlsx');
            toast.success('Records downloaded successfully');
        } catch (error) {
            console.error('Error downloading records:', error);
            toast.error('Failed to download records');
        }
    };

    const handleFileDownload = (record) => {
        try {
            if (!record.file) {
                toast.error("No file available for download");
                return;
            }

            // For files stored as base64
            if (record.file.startsWith('data:')) {
                const [header, base64Data] = record.file.split(',');
                const mimeType = header.split(':')[1].split(';')[0];
                
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });
                
                // Create a download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = record.fileName || 'download';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("File downloaded successfully!");
            } 
            // For files stored as URLs (e.g., from Firebase Storage)
            else {
                window.open(record.file, '_blank');
            }
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Failed to download file");
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div style={{
                    color: darkMode ? '#fff' : '#333',
                    fontSize: '1.2rem'
                }}>Loading records...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div style={{
                    backgroundColor: darkMode ? 'rgba(33, 33, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    padding: '2rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: darkMode ? '#fff' : '#333'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: darkMode ? 'rgba(33, 33, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        color: darkMode ? '#fff' : '#333',
                        fontSize: '2rem',
                        marginBottom: '0'
                    }}>
                        Health Records
                    </h1>
                    {records.length > 0 && (
                        <button
                            onClick={downloadAsExcel}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            Download Records
                        </button>
                    )}
                </div>

                {records.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: darkMode ? '#fff' : '#333',
                        fontSize: '1.2rem',
                        marginTop: '2rem'
                    }}>
                        No health records available.
                    </p>
                ) : (
                    <div style={{
                        overflowX: 'auto'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                                }}>
                                    <th style={{
                                        padding: '1rem',
                                        color: darkMode ? '#fff' : '#333',
                                        textAlign: 'left',
                                        fontWeight: '600'
                                    }}>Date</th>
                                    <th style={{
                                        padding: '1rem',
                                        color: darkMode ? '#fff' : '#333',
                                        textAlign: 'left',
                                        fontWeight: '600'
                                    }}>Age</th>
                                    <th style={{
                                        padding: '1rem',
                                        color: darkMode ? '#fff' : '#333',
                                        textAlign: 'left',
                                        fontWeight: '600'
                                    }}>Disease</th>
                                    <th style={{
                                        padding: '1rem',
                                        color: darkMode ? '#fff' : '#333',
                                        textAlign: 'left',
                                        fontWeight: '600'
                                    }}>Hospital</th>
                                    <th style={{
                                        padding: '1rem',
                                        color: darkMode ? '#fff' : '#333',
                                        textAlign: 'left',
                                        fontWeight: '600'
                                    }}>Doctor</th>
                                    <th style={{
                                        padding: '1rem',
                                        color: darkMode ? '#fff' : '#333',
                                        textAlign: 'left',
                                        fontWeight: '600'
                                    }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        style={{
                                            backgroundColor: index % 2 === 0
                                                ? (darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)')
                                                : 'transparent'
                                        }}
                                    >
                                        <td style={{
                                            padding: '1rem',
                                            color: darkMode ? '#fff' : '#333'
                                        }}>{record.date}</td>
                                        <td style={{
                                            padding: '1rem',
                                            color: darkMode ? '#fff' : '#333'
                                        }}>{record.age}</td>
                                        <td style={{
                                            padding: '1rem',
                                            color: darkMode ? '#fff' : '#333'
                                        }}>{record.disease}</td>
                                        <td style={{
                                            padding: '1rem',
                                            color: darkMode ? '#fff' : '#333'
                                        }}>{record.hospital}</td>
                                        <td style={{
                                            padding: '1rem',
                                            color: darkMode ? '#fff' : '#333'
                                        }}>{record.doctor}</td>
                                        <td style={{
                                            padding: '1rem'
                                        }}>
                                            {record.file && (
                                                <button
                                                    onClick={() => handleFileDownload(record)}
                                                    style={{
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '4px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        transition: 'background-color 0.3s ease'
                                                    }}
                                                >
                                                    Download File
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicRecord; 