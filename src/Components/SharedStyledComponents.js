import styled from "styled-components"

// Colors
export const primaryColor = "#6F8B83"
export const backgroundColor = "#F9F9F9"
export const textColor = "#333"
export const accentColor = "#9aaea9"

// Shared Form Components
export const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${backgroundColor} 0%, ${accentColor}40 100%);
  padding: 40px 20px;
`

export const FormContainer = styled.div`
  background-color: #FFFFFF;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1000px;
  transition: all 0.3s ease;
`

export const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 40px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${accentColor};
    border-radius: 2px;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
`

export const SectionTitle = styled.h3`
  color: ${primaryColor};
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 1px solid ${accentColor}80;
  padding-bottom: 10px;
`

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  margin-bottom: 8px;
  font-family: 'Roboto', sans-serif;
  display: block;
`

export const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #fafafa;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }
`

export const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background-color: #fafafa;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }
`

export const Button = styled.button`
  padding: 12px 34px;
  background-color: ${primaryColor};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px ${primaryColor}40;

  &:hover {
    background-color: ${accentColor};
    transform: translateY(-3px);
    box-shadow: 0 6px 15px ${primaryColor}40;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px ${primaryColor}40;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`

// Report specific components
export const ReportContainer = styled.div`
  background-color: #FFFFFF;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1200px;
  transition: all 0.3s ease;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

export const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid ${accentColor};
`

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: ${accentColor}20;
    cursor: pointer;
  }
`

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  color: ${textColor};
`

export const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: end;
`

export const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: end;
`
