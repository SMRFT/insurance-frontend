import React, { useState,useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo1 from './Images/logo512.png'

// Styled Components
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
              url(${require('../Components/Images/login.jpg')}) no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  max-height: 700px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
`;

const ImageSection = styled.div`
  flex: 1;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ImageText = styled.div`
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  h2 {
    font-size: 2.2rem;
    margin-bottom: 15px;
  }
  
  p {
    font-size: 1.1rem;
    max-width: 400px;
  }
`;

const FormSection = styled.div`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #6F8B83;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  text-align: center;
  font-size: 1.8rem;
  color: #6F8B83;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #DFE6E9;
  border-radius: 8px;
  font-size: 14px;
  color: #2D3436;
  background-color: #F8F9FA;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    background-color: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(111, 139, 131, 0.2);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: #6F8B83;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #6F8B83;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(111, 139, 131, 0.2);
  
  &:hover {
    background-color: #9aaea9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(111, 139, 131, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ForgotPassword = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #6F8B83;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Component
function Login() {
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    // Remove tokens when user lands on login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.id || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      toast.info('Logging in...', { autoClose: false, toastId: 'login' });
      
      const response = await axios.post(`${Insurancebaseurl}login/`, formData);
      
      if (response.status === 200) {
        toast.dismiss('login');
        toast.success('Login successful! Redirecting...');
        const { user, access, refresh } = response.data;
        const role = user.role; // assuming this exists
        // Store user info and JWT
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        console.log('User info:', response.data.user);
        
        // Redirect after toast is shown
        setTimeout(() => {
          if (role === 'EMPLOYEE') {
            navigate('/InsuranceForm');
          } else if (role === 'SUPER ADMIN') {
            navigate('/Daycare');
          } else {
            navigate('/InsuranceReport'); // default or admin
          }
        }, 1500);
      }
    } catch (error) {
      toast.dismiss('login');
      console.error(error.response || error.message);
      
      if (error.response && error.response.status === 401) {
        toast.error('Invalid ID or password.');
      } else if (error.response && error.response.status === 404) {
        toast.error('User does not exist.');
      } else {
        toast.error('Connection error. Please try again.');
      }
    }
  };
  
  return (
    <PageWrapper>
      <ContentWrapper>
        <ImageSection>
          <ImageText>
          {/* <img src={Logo1} alt="App Logo" style={{ height: '300px' }} /> */}
            <h2>Shanmuga Insurance Tracking </h2>
            {/* <p>Streamline your insurance claims and manage your portfolio efficiently with our comprehensive tracking solution.</p> */}
          </ImageText>
        </ImageSection>
        
        <FormSection>
          <FormContainer>
            <Logo>
              <img src={Logo1} alt="App Logo" style={{ height: '70px' }} />
            </Logo>
            
            <Title>Insurance Login</Title>
            
            <form onSubmit={handleSubmit}>
              <InputGroup>
                <Input
                  type="text"
                  name="id"
                  placeholder="Employee ID"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />
                <InputIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </InputIcon>
              </InputGroup>
              
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <InputIcon onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </InputIcon>
              </InputGroup>
              
              <Button type="submit">Sign In</Button>
            </form>
            
            {/* <ForgotPassword>Forgot Password?</ForgotPassword> */}
          </FormContainer>
        </FormSection>
      </ContentWrapper>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </PageWrapper>
  );
}

export default Login;