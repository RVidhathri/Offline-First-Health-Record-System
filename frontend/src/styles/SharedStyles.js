import styled from 'styled-components';

export const PageContainer = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${props => props.darkMode ? '#1a1a1a' : '#f5f5f5'};
`;

export const ContentContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

export const Card = styled.div`
    background: ${props => props.darkMode ? '#2d2d2d' : '#ffffff'};
    border-radius: 8px;
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 2px 4px ${props => props.darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
`;
