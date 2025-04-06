import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

// Image URLs from Firebase Storage
const IMAGE_URLS = {
    offline: 'https://firebasestorage.googleapis.com/v0/b/secret-cipher-453016-s5.appspot.com/o/offline.jpeg?alt=media',
    secureStorage: 'https://firebasestorage.googleapis.com/v0/b/secret-cipher-453016-s5.appspot.com/o/secure-storage.jpeg?alt=media',
    easySharing: 'https://firebasestorage.googleapis.com/v0/b/secret-cipher-453016-s5.appspot.com/o/easy-sharing.jpeg?alt=media',
    ourMission: 'https://firebasestorage.googleapis.com/v0/b/secret-cipher-453016-s5.appspot.com/o/our-mission.jpeg?alt=media',
    privacyFirst: 'https://firebasestorage.googleapis.com/v0/b/secret-cipher-453016-s5.appspot.com/o/privacy-first.png?alt=media',
    innovation: 'https://firebasestorage.googleapis.com/v0/b/secret-cipher-453016-s5.appspot.com/o/innovation.jpeg?alt=media'
};

const PageContainer = styled.div`
    min-height: 100vh;
    overflow-y: auto;
    background: ${props => props.darkMode ? '#1a1a1a' : '#f5f5f5'};
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
`;

const HeroSection = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'};
    border-radius: 20px;
    box-shadow: 0 4px 6px ${props => props.darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
`;

const Title = styled.h1`
    font-size: ${props => props.isMobile ? '2rem' : '3rem'};
    color: ${props => props.darkMode ? '#ffffff' : '#333333'};
    margin-bottom: 1.5rem;
    font-weight: bold;
    line-height: 1.2;
`;

const Subtitle = styled.p`
    font-size: ${props => props.isMobile ? '1.1rem' : '1.25rem'};
    color: ${props => props.darkMode ? '#cccccc' : '#666666'};
    margin-bottom: 2rem;
    line-height: 1.6;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
`;

const Button = styled(Link)`
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    
    ${props => props.primary ? `
        background: #007bff;
        color: white;
        &:hover {
            background: #0056b3;
            transform: translateY(-2px);
        }
    ` : `
        background: ${props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
        color: ${props.darkMode ? '#ffffff' : '#333333'};
        &:hover {
            background: ${props.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
            transform: translateY(-2px);
        }
    `}
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin: 4rem auto;
    padding: 0 1rem;
    max-width: 1200px;
`;

const FeatureCard = styled.div`
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px ${props => props.darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};

    &:hover {
        transform: translateY(-5px);
    }

    h3 {
        color: ${props => props.darkMode ? '#ffffff' : '#333333'};
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    p {
        color: ${props => props.darkMode ? '#cccccc' : '#666666'};
        line-height: 1.6;
    }

    img {
        width: 100%;
        height: 200px;
        margin-bottom: 1.5rem;
        border-radius: 12px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }
`;

const AboutSection = styled.section`
    padding: 4rem 2rem;
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'};
    margin: 2rem auto;
    border-radius: 20px;
    max-width: 1200px;
`;

const AboutGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
    align-items: center;
    margin-top: 3rem;
`;

const AboutCard = styled.div`
    text-align: left;
    padding: 2rem;
    border-radius: 12px;
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'};
    box-shadow: 0 4px 6px ${props => props.darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};

    h3 {
        color: ${props => props.darkMode ? '#ffffff' : '#333333'};
        margin-bottom: 1rem;
        font-size: 1.8rem;
    }

    p {
        color: ${props => props.darkMode ? '#cccccc' : '#666666'};
        line-height: 1.8;
        font-size: 1.1rem;
    }

    img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
`;

const Home = () => {
    const { darkMode } = useTheme();
    const { currentUser } = useAuth();
    const isMobile = useMediaQuery({ maxWidth: 768 });

    return (
        <PageContainer darkMode={darkMode}>
            <Container>
                <HeroSection darkMode={darkMode}>
                    <Title darkMode={darkMode} isMobile={isMobile}>
                        Your Health Records, Anywhere, Anytime
                    </Title>
                    <Subtitle darkMode={darkMode} isMobile={isMobile}>
                        Securely store and manage your health records with our offline-first platform. 
                        Access your medical history even without an internet connection.
                    </Subtitle>
                    <ButtonGroup>
                        {currentUser ? (
                            <Button to="/records" primary>
                                View My Records
                            </Button>
                        ) : (
                            <>
                                <Button to="/register" primary>
                                    Get Started
                                </Button>
                                <Button to="/login" darkMode={darkMode}>
                                    Sign In
                                </Button>
                            </>
                        )}
                    </ButtonGroup>
                </HeroSection>

                <FeatureGrid>
                    <FeatureCard darkMode={darkMode}>
                        <img src={IMAGE_URLS.offline} alt="Offline Access" />
                        <h3>Offline Access</h3>
                        <p>Access your health records anytime, even without internet connectivity. Your data stays with you.</p>
                    </FeatureCard>
                    <FeatureCard darkMode={darkMode}>
                        <img src={IMAGE_URLS.secureStorage} alt="Secure Storage" />
                        <h3>Secure Storage</h3>
                        <p>Your data is encrypted and stored securely on your device, ensuring complete privacy.</p>
                    </FeatureCard>
                    <FeatureCard darkMode={darkMode}>
                        <img src={IMAGE_URLS.easySharing} alt="Easy Sharing" />
                        <h3>Easy Sharing</h3>
                        <p>Share your records with healthcare providers using QR codes when needed.</p>
                    </FeatureCard>
                </FeatureGrid>

                <AboutSection darkMode={darkMode}>
                    <Title darkMode={darkMode} isMobile={isMobile} style={{ fontSize: isMobile ? '1.8rem' : '2.5rem' }}>
                        About Our Platform
                    </Title>
                    <AboutGrid>
                        <AboutCard darkMode={darkMode}>
                            <img src={IMAGE_URLS.ourMission} alt="Our Mission" />
                            <h3>Our Mission</h3>
                            <p>
                                We're committed to revolutionizing healthcare record management by providing a secure, 
                                accessible, and user-friendly platform that puts you in control of your health data.
                            </p>
                        </AboutCard>
                        <AboutCard darkMode={darkMode}>
                            <img src={IMAGE_URLS.privacyFirst} alt="Privacy First" />
                            <h3>Privacy First</h3>
                            <p>
                                Your privacy is our top priority. We use state-of-the-art encryption and offline-first 
                                technology to ensure your health records are always secure and accessible only to you.
                            </p>
                        </AboutCard>
                        <AboutCard darkMode={darkMode}>
                            <img src={IMAGE_URLS.innovation} alt="Innovation" />
                            <h3>Innovation</h3>
                            <p>
                                We leverage cutting-edge technology to provide seamless offline access, easy sharing 
                                capabilities, and a user-friendly interface for managing your health records.
                            </p>
                        </AboutCard>
                    </AboutGrid>
                </AboutSection>
            </Container>
        </PageContainer>
    );
};

export default Home;
