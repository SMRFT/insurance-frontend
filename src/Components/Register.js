import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Updated color scheme variables
const primaryColor = "#6F8B83"; // Sage green
const backgroundColor = "#F9F9F9"; // Off-white
const textColor = "#333"; // Dark gray
const accentColor = "#9aaea9"; // Light sage green
const gradientStart = "#5a7670"; // Darker sage
const gradientEnd = "#8aa6a0"; // Lighter sage
const borderRadius = "10px";

// Styled Components with updated layout and styling
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${backgroundColor};
  padding: 20px;
  font-family: 'Inter', system-ui, sans-serif;
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: ${borderRadius};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 80%;
  max-width: 1000px;
  transition: all 0.3s ease;
  border-top: 4px solid ${primaryColor};
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;

const FormHeader = styled.div`
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, ${gradientStart}, ${gradientEnd} 70%);
  color: white;
  border-radius: ${borderRadius} ${borderRadius} 0 0;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 28px;
`;

const SubTitle = styled.p`
  font-size: 15px;
  opacity: 0.9;
`;

const FormContent = styled.div`
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 22px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${textColor};
  font-weight: 500;
  font-size: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  margin: 8px 0;
  border: 1px solid #e5e7eb;
  border-radius: ${borderRadius};
  font-size: 15px;
  color: ${textColor};
  transition: all 0.2s ease;
  background-color: #fff;
  
  &:focus {
    border-color: ${primaryColor};
    box-shadow: 0 0 0 3px rgba(111, 139, 131, 0.2);
    outline: none;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  margin: 8px 0;
  border: 1px solid #e5e7eb;
  border-radius: ${borderRadius};
  font-size: 15px;
  color: ${textColor};
  background-color: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236F8B83'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  
  &:focus {
    border-color: ${primaryColor};
    box-shadow: 0 0 0 3px rgba(111, 139, 131, 0.2);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  margin-top: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, ${gradientStart}, ${gradientEnd});
  color: white;
  border: none;
  border-radius: ${borderRadius};
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(111, 139, 131, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MessageContainer = styled.div`
  grid-column: 1 / -1;
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  text-align: center;
  margin-top: 16px;
  padding: 14px;
  background-color: #FEF2F2;
  border-radius: ${borderRadius};
  border-left: 4px solid #EF4444;
`;

const SuccessMessage = styled.div`
  color: #10B981;
  text-align: center;
  margin-top: 16px;
  padding: 14px;
  background-color: #ECFDF5;
  border-radius: ${borderRadius};
  font-weight: 500;
  border-left: 4px solid #10B981;
`;

const FormFooter = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 0 0 ${borderRadius} ${borderRadius};
  color: ${textColor};
  font-size: 14px;
  border-top: 1px solid #eee;
`;

const StyledLink = styled.a`
  color: ${primaryColor};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
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
      const response = await axios.post('https://insurance.shinovadatabase.in/registration/', formData);
      if (response.status === 201) {
        setSuccess('Registration successful! You can now log in to your account.');
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
    <PageWrapper>
      <FormContainer>
        <FormHeader>
          <Title>Create Account</Title>
          <SubTitle>Enter your details to register</SubTitle>
        </FormHeader>
        
        <form onSubmit={handleSubmit}>
          <FormContent>
            <FormGroup>
              <Label htmlFor="id">Employee ID</Label>
              <Input 
                type="text" 
                id="id" 
                name="id" 
                placeholder="Enter your employee ID" 
                value={formData.id} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@company.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER ADMIN">SUPER ADMIN</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Create a strong password" 
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
            
            <ButtonGroup>
              <Button type="submit">Create Account</Button>
            </ButtonGroup>
            
            <MessageContainer>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
            </MessageContainer>
          </FormContent>
        </form>
        
      </FormContainer>
    </PageWrapper>
  );
}

export default Register;