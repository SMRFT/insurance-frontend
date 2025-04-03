import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
// Styled Components
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: url(${require('../Components/Images/login.jpg')}) no-repeat center center;
  background-size: cover;
`;
const FormContainer = styled.div`
  position: absolute;
  right: 10%; /* Position the container on the right side */
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9); /* Slight transparency */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  height: 350px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;
const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  text-align: center;
  font-size: 1.8rem;
  color: #6F8B83;
  margin-bottom: 20px;
`;
const Input = styled.input`
  width: 90%;
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #DFE6E9;
  border-radius: 8px;
  font-size: 14px;
  color: #2D3436;
  background-color: #F8F9FA;
  transition: border-color 0.2s;
  &:focus {
    border-color: #74B9FF;
    outline: none;
    background-color: #FFFFFF;
  }
`;
const Button = styled.button`
  width: fit-content;
  padding: 15px 40px;
  background-color: #6F8B83;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #9aaea9;
  }
`;
const ErrorMessage = styled.div`
  color: #D63031;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
`;
// Component
function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', formData);
      if (response.status === 200) {
        alert('Login successful!');
      }
    } catch (error) {
      console.error(error.response || error.message); // Log the exact error
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password.');
      } else if (error.response && error.response.status === 404) {
        setError('User does not exist.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };
  
  return (
    <PageWrapper>
      <FormContainer>
        <Title>Insurance Login</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="User's name or Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Sign In</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </FormContainer>
    </PageWrapper>
  );
}
export default Login;