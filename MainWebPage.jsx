import React from 'react';
import styled from 'styled-components';

// Styled Components for your page
const MainPage = styled.div`
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
  color: white;
  min-height: 100vh;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;
  text-shadow: 0 0 10px #0ff;
`;

const Paragraph = styled.p`
  font-size: 24px;
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 30px;
`;

const GetStartedButton = styled.button`
  background-color: #00ffff;
  color: #001f3f;
  padding: 15px 35px;
  border: none;
  border-radius: 50px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;

  &:hover {
    background-color: #00ccff;
    transform: scale(1.1);
  }
`;

function MainWebPage() {
  return (
    <MainPage>
      <Heading>Welcome to AI Clinic</Heading>
      <Paragraph>Your futuristic health assistant is here. Let's get started!</Paragraph>
      <GetStartedButton>Get Started</GetStartedButton>
    </MainPage>
  );
}

export default MainWebPage;
