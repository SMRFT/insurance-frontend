import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components for Styling
const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f1f1f1;
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
  color: #0078d7;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  &:focus {
    border-color: #0078d7;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #0078d7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #005cbf;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/registration/', formData);
      if (response.status === 201) {
        // Handle successful registration (e.g., redirect to login page)
        alert('Registration successful!');
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <FormWrapper>
      <FormContainer>
        <Title>Register</Title>
        <form onSubmit={handleSubmit}>
          <Input type="text" name="id" placeholder="id" value={formData.id} onChange={handleChange} required />
          <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <Button type="submit">Register</Button>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
    </FormWrapper>
  );
}

export default Register;
