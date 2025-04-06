import React, { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const PageContainer = styled.div`
    min-height: 100vh;
    padding: 6rem 1rem 2rem;
    background: ${props => props.darkMode ? '#1a1a1a' : '#f5f5f5'};
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    background: ${props => props.darkMode ? '#2d2d2d' : '#ffffff'};
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: ${props => props.isMobile ? '1.5rem' : '2rem'};
    color: ${props => props.darkMode ? '#fff' : '#333'};
    margin: 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.primary ? '#007bff' : '#28a745'};
    color: white;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const SearchSection = styled.div`
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Select = styled.select`
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};
    background: ${props => props.darkMode ? '#333' : '#fff'};
    color: ${props => props.darkMode ? '#fff' : '#333'};
    min-width: 150px;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const SearchInput = styled.input`
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};
    background: ${props => props.darkMode ? '#333' : '#fff'};
    color: ${props => props.darkMode ? '#fff' : '#333'};
    flex: 1;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 1rem;
`;

const Th = styled.th`
    text-align: left;
    padding: 1rem;
    background: ${props => props.darkMode ? '#333' : '#f8f9fa'};
    color: ${props => props.darkMode ? '#fff' : '#333'};
    font-weight: 600;
    border-bottom: 2px solid ${props => props.darkMode ? '#444' : '#dee2e6'};

    &:first-child {
        border-top-left-radius: 8px;
    }

    &:last-child {
        border-top-right-radius: 8px;
    }
`;

const Td = styled.td`
    padding: 1rem;
    color: ${props => props.darkMode ? '#fff' : '#333'};
    border-bottom: 1px solid ${props => props.darkMode ? '#444' : '#dee2e6'};
`;

const Tr = styled.tr`
    &:hover {
        background: ${props => props.darkMode ? '#383838' : '#f8f9fa'};
    }
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`;

const ModalContent = styled.div`
    background: ${props => props.darkMode ? '#2d2d2d' : '#fff'};
    padding: 2rem;
    border-radius: 15px;
    width: 100%;
    max-width: 500px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    color: ${props => props.darkMode ? '#fff' : '#333'};
    font-weight: 500;
`;

const Input = styled.input`
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};
    background: ${props => props.darkMode ? '#333' : '#fff'};
    color: ${props => props.darkMode ? '#fff' : '#333'};
`;

const Records = () => {
    const { darkMode } = useTheme();
    const [showAddForm, setShowAddForm] = useState(false);
    const [records, setRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({
        age: "",
        date: "",
        disease: "",
        hospital: "",
        doctor: "",
        file: null,
        fileName: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("all");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        loadRecords();
    }, [currentUser, navigate]);

    const loadRecords = async () => {
        try {
            setLoading(true);
            if (!currentUser) return;

            const q = query(
                collection(db, "records"),
                where("userId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const records = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecords(records);
            setLoading(false);
        } catch (error) {
            console.error("Error loading records:", error);
            toast.error("Failed to load records");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!currentUser) {
                toast.error("Please login to add records");
                navigate("/login");
                return;
            }

            const recordData = {
                ...newRecord,
                userId: currentUser.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "records"), recordData);
            recordData.id = docRef.id;

            setRecords(prev => [...prev, recordData]);
            setNewRecord({
                age: "",
                date: "",
                disease: "",
                hospital: "",
                doctor: "",
                file: null,
                fileName: "",
            });
            setShowAddForm(false);
            toast.success("Record added successfully!");
        } catch (error) {
            console.error("Error adding record:", error);
            toast.error("Failed to add record");
        }
    };

    const handleDelete = async (recordId) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await deleteDoc(doc(db, "records", recordId));
                setRecords(prev => prev.filter(record => record.id !== recordId));
                toast.success("Record deleted successfully!");
            } catch (error) {
                console.error("Error deleting record:", error);
                toast.error("Failed to delete record");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const downloadRecordsAsExcel = () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(
                records.map(record => ({
                    Date: new Date(record.date).toLocaleDateString(),
                    Age: record.age,
                    Disease: record.disease,
                    Hospital: record.hospital,
                    Doctor: record.doctor
                }))
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Health Records");
            XLSX.writeFile(workbook, "health_records.xlsx");
            toast.success("Records downloaded successfully!");
        } catch (error) {
            console.error("Error downloading records:", error);
            toast.error("Failed to download records");
        }
    };

    const filteredRecords = records.filter(record => {
        if (searchTerm === "") return true;
        
        if (searchColumn === "all") {
            return Object.values(record).some(value => 
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return record[searchColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <PageContainer darkMode={darkMode}>
                <ContentWrapper darkMode={darkMode}>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                </ContentWrapper>
            </PageContainer>
        );
    }

    return (
        <PageContainer darkMode={darkMode}>
            <ContentWrapper darkMode={darkMode}>
                <Header>
                    <Title darkMode={darkMode} isMobile={isMobile}>
                        Health Records
                        <div style={{ fontSize: '0.9rem', color: darkMode ? '#aaa' : '#666' }}>
                            {records.length} {records.length === 1 ? 'Record' : 'Records'}
                        </div>
                    </Title>
                    <ButtonGroup>
                        <Button onClick={downloadRecordsAsExcel}>
                            Download All
                        </Button>
                        <Button primary onClick={() => setShowAddForm(true)}>
                            Add New
                        </Button>
                    </ButtonGroup>
                </Header>

                <SearchSection>
                    <Select
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value)}
                        darkMode={darkMode}
                    >
                        <option value="all">All Columns</option>
                        <option value="date">Date</option>
                        <option value="age">Age</option>
                        <option value="disease">Disease</option>
                        <option value="hospital">Hospital</option>
                        <option value="doctor">Doctor</option>
                    </Select>
                    <SearchInput
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        darkMode={darkMode}
                    />
                </SearchSection>

                <div style={{ overflowX: 'auto' }}>
                    <Table>
                        <thead>
                            <tr>
                                <Th darkMode={darkMode}>Date</Th>
                                <Th darkMode={darkMode}>Age</Th>
                                <Th darkMode={darkMode}>Disease</Th>
                                <Th darkMode={darkMode}>Hospital</Th>
                                <Th darkMode={darkMode}>Doctor</Th>
                                <Th darkMode={darkMode}>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <Tr key={record.id} darkMode={darkMode}>
                                    <Td darkMode={darkMode}>{new Date(record.date).toLocaleDateString()}</Td>
                                    <Td darkMode={darkMode}>{record.age}</Td>
                                    <Td darkMode={darkMode}>{record.disease}</Td>
                                    <Td darkMode={darkMode}>{record.hospital}</Td>
                                    <Td darkMode={darkMode}>{record.doctor}</Td>
                                    <Td darkMode={darkMode}>
                                        <Button onClick={() => handleDelete(record.id)}>
                                            Delete
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {showAddForm && (
                    <Modal>
                        <ModalContent darkMode={darkMode}>
                            <Title darkMode={darkMode} isMobile={isMobile} style={{ marginBottom: '1.5rem' }}>
                                Add New Record
                            </Title>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label darkMode={darkMode}>Date</Label>
                                    <Input
                                        type="date"
                                        name="date"
                                        value={newRecord.date}
                                        onChange={handleInputChange}
                                        required
                                        darkMode={darkMode}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label darkMode={darkMode}>Age</Label>
                                    <Input
                                        type="number"
                                        name="age"
                                        value={newRecord.age}
                                        onChange={handleInputChange}
                                        required
                                        darkMode={darkMode}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label darkMode={darkMode}>Disease</Label>
                                    <Input
                                        type="text"
                                        name="disease"
                                        value={newRecord.disease}
                                        onChange={handleInputChange}
                                        required
                                        darkMode={darkMode}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label darkMode={darkMode}>Hospital</Label>
                                    <Input
                                        type="text"
                                        name="hospital"
                                        value={newRecord.hospital}
                                        onChange={handleInputChange}
                                        required
                                        darkMode={darkMode}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label darkMode={darkMode}>Doctor</Label>
                                    <Input
                                        type="text"
                                        name="doctor"
                                        value={newRecord.doctor}
                                        onChange={handleInputChange}
                                        required
                                        darkMode={darkMode}
                                    />
                                </FormGroup>
                                <ButtonGroup>
                                    <Button type="button" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" primary>
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </Form>
                        </ModalContent>
                    </Modal>
                )}
            </ContentWrapper>
        </PageContainer>
    );
};

export default Records;
