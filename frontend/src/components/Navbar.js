import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const NavContainer = styled.nav`
    background: ${props => props.darkMode ? 'rgba(17, 25, 40, 0.75)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(16px);
    padding: 1rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 0.5rem;

    img {
        height: 40px;
        width: auto;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        display: ${props => props.isOpen ? 'flex' : 'none'};
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: ${props => props.darkMode ? 'rgba(17, 25, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        backdrop-filter: blur(16px);
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;

const NavLink = styled(Link)`
    color: ${props => props.darkMode ? '#fff' : '#333'};
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: ${props => props.active ? (props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'};

    &:hover {
        background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        width: 100%;
        text-align: center;
        padding: 0.75rem 1rem;
    }
`;

const MenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: ${props => props.darkMode ? '#fff' : '#333'};
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    }

    @media (max-width: 768px) {
        display: block;
    }
`;

const ThemeToggle = styled.button`
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    border: none;
    color: ${props => props.darkMode ? '#fff' : '#333'};
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
        transform: translateY(-2px);
    }

    span {
        font-size: 0.9rem;
        @media (max-width: 768px) {
            display: none;
        }
    }
`;

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const closeMenu = () => {
        if (isMobile) {
            setIsMenuOpen(false);
        }
    };

    return (
        <NavContainer darkMode={darkMode}>
            <NavContent>
                <Logo to="/" darkMode={darkMode} onClick={closeMenu}>
                    <img src="/logo.png" alt="Logo" />
                </Logo>

                <MenuButton 
                    darkMode={darkMode} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </MenuButton>

                <NavLinks darkMode={darkMode} isOpen={isMenuOpen}>
                    <NavLink 
                        to="/" 
                        darkMode={darkMode} 
                        active={location.pathname === '/'} 
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>
                    
                    {currentUser ? (
                        <>
                            <NavLink 
                                to="/records" 
                                darkMode={darkMode} 
                                active={location.pathname === '/records'}
                                onClick={closeMenu}
                            >
                                Records
                            </NavLink>
                            <NavLink 
                                to="/profile" 
                                darkMode={darkMode} 
                                active={location.pathname === '/profile'}
                                onClick={closeMenu}
                            >
                                Profile
                            </NavLink>
                            <NavLink 
                                to="#" 
                                onClick={() => {
                                    handleLogout();
                                    closeMenu();
                                }} 
                                darkMode={darkMode}
                            >
                                Logout
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink 
                                to="/login" 
                                darkMode={darkMode} 
                                active={location.pathname === '/login'}
                                onClick={closeMenu}
                            >
                                Login
                            </NavLink>
                            <NavLink 
                                to="/register" 
                                darkMode={darkMode} 
                                active={location.pathname === '/register'}
                                onClick={closeMenu}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                    
                    <ThemeToggle 
                        onClick={() => {
                            toggleTheme();
                            closeMenu();
                        }} 
                        darkMode={darkMode}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? '🌞' : '🌙'}
                        <span>{darkMode ? 'Light' : 'Dark'}</span>
                    </ThemeToggle>
                </NavLinks>
            </NavContent>
        </NavContainer>
    );
};

export default Navbar; 