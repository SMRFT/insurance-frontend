import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Color scheme variables
const primaryColor = "#6F8B83";
const backgroundColor = "#F9F9F9";
const textColor = "#333";
const accentColor = "#9aaea9";

// Styled Components for Styling
const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${backgroundColor};
  padding: 20px;
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: ${textColor};
  &:focus {
    border-color: ${primaryColor};
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${primaryColor};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${accentColor};
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: ${textColor};
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  color: ${primaryColor};
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(111, 139, 131, 0.1);
  border-radius: 5px;
`;

function Register() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/registration/', formData);
      if (response.status === 201) {
        setSuccess('Registration successful!');
        setFormData({
          id: '',
          name: '',
          email: '',
          role: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred during registration.');
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  return (
    <FormWrapper>
      <FormContainer>
        <Title>Register</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="id">ID</Label>
            <Input 
              type="text" 
              id="id" 
              name="id" 
              placeholder="Enter your ID" 
              value={formData.id} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter your name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Input 
              type="text" 
              id="role" 
              name="role" 
              placeholder="Enter your role" 
              value={formData.role} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <Button type="submit">Register</Button>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </FormContainer>
    </FormWrapper>
  );
}

export default Register;