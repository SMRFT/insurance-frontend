import styled from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Colors
const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"

// Fully responsive FormContainer - no fixed max-width
export const FormContainer = styled.div`
  background-color: #FFFFFF;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  @media (max-width: 1200px) {
    padding: 35px;
  }
  
  @media (max-width: 1024px) {
    padding: 30px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`

export const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`

export const SectionTitle = styled.h3`
  color: ${primaryColor};
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 1px solid ${accentColor}80;
  padding-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 12px;
    padding-bottom: 8px;
  }
`

// Fully responsive CenteredContainer - adapts to screen width
export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto 25px;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`

export const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background-color: #fafafa;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
    margin-bottom: 10px;
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
  box-sizing: border-box;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
    margin-bottom: 10px;
  }
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 10px;
  }
`

export const RadioLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    accent-color: ${primaryColor};
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    gap: 6px;
    
    input {
      width: 15px;
      height: 15px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    
    input {
      width: 14px;
      height: 14px;
    }
  }
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    margin-top: 15px;
    flex-direction: column;
  }
`

// Fully responsive FormWrapper - takes full width on all screens
export const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${backgroundColor} 0%, ${accentColor}40 100%);
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 15px;
    min-height: 100vh;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
  
  @media (max-width: 360px) {
    padding: 8px;
  }
`

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 150px;
  flex: 1;
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    min-width: 130px;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    margin-bottom: 10px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 8px;
  }
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
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 25px;
    
    &:after {
      width: 60px;
      height: 2px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 20px;
    
    &:after {
      width: 50px;
    }
  }
`

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  margin-bottom: 8px;
  font-family: 'Roboto', sans-serif;
  display: block;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 5px;
  }
`

export const Button = styled.button`
  padding: 10px 16px;
  background-color: ${primaryColor};
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px ${primaryColor}40;
  min-width: 100px;

  &:hover {
    background-color: ${accentColor};
    transform: translateY(-2px);
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
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 9px 14px;
    min-width: 90px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
    min-width: 80px;
    width: 100%;
  }
`

// Fully responsive ReportContainer - adapts to all screen sizes
export const ReportContainer = styled.div`
  background-color: #FFFFFF;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  @media (max-width: 1400px) {
    padding: 35px;
  }
  
  @media (max-width: 1200px) {
    padding: 30px;
  }
  
  @media (max-width: 1024px) {
    padding: 25px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
  }
  
  @media (max-width: 576px) {
    padding: 15px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 360px) {
    padding: 10px;
  }
`

export const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    box-shadow: 0 0 0 2px #6F8B8330;
  }
  
  @media (max-width: 768px) {
    padding: 7px 10px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 12px;
  }
`

export const FormControl = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
  box-sizing: border-box;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    box-shadow: 0 0 0 2px #6F8B8330;
  }
  
  @media (max-width: 768px) {
    padding: 7px 10px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 12px;
  }
`

export const StyledDatePicker = styled(DatePicker)`
  padding: 10px 14px;
  border: 1px soid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    border-color: #6F8B83;
    outline: none;
    box-shadow: 0 0 0 2px #6F8B8330;
  }
  
  @media (max-width: 768px) {
    padding: 7px 10px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 12px;
  }
`

export const ScrollableTableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  scrollbar-width: thin;
  border: 1px solid ${accentColor};
  border-radius: 10px;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${accentColor};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${primaryColor};
  }
  
  @media (max-width: 1024px) {
    max-height: 450px;
  }
  
  @media (max-width: 768px) {
    max-height: 400px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    max-height: 350px;
    border-radius: 6px;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }
  
  @media (max-width: 360px) {
    max-height: 300px;
  }
`

export const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  margin: 0;
  background-color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  
  @media (max-width: 1024px) {
    min-width: 700px;
    font-size: 12px;
  }
  
  @media (max-width: 768px) {
    font-size: 11px;
    min-width: 600px;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    min-width: 500px;
  }
  
  @media (max-width: 360px) {
    font-size: 9px;
    min-width: 450px;
  }
`

export const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px 8px;
  text-align: center;
  border: 1px solid ${accentColor};
  top: 0;
  z-index: 5;
  letter-spacing: 0.5px;
  white-space: nowrap;
  font-size: inherit;
  position: sticky;
  font-weight: 600;
  
  @media (max-width: 1024px) {
    padding: 10px 6px;
  }
  
  @media (max-width: 768px) {
    padding: 8px 5px;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 4px;
    letter-spacing: 0.2px;
  }
  
  @media (max-width: 360px) {
    padding: 5px 3px;
  }
`

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(111, 139, 131, 0.2);
    transition: background-color 0.3s ease;
  }
`

export const TableCell = styled.td`
  padding: 10px 8px;
  color: ${textColor};
  border: 1px solid ${accentColor};
  text-align: center;
  white-space: nowrap;
  line-height: 1.5;
  max-width: 200px;
  font-size: inherit;
  
  @media (max-width: 1024px) {
    padding: 8px 6px;
    max-width: 150px;
  }
  
  @media (max-width: 768px) {
    padding: 7px 5px;
    max-width: 120px;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    padding: 6px 4px;
    max-width: 100px;
    line-height: 1.3;
  }
  
  @media (max-width: 360px) {
    padding: 5px 3px;
    max-width: 90px;
  }
`

// Fully responsive Container - adapts to all screens
export const Container = styled.div`
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor});
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0 auto;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 18px;
  }

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 10px;
  }

  @media (max-width: 576px) {
    padding: 12px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }

  @media (max-width: 360px) {
    padding: 8px;
  }

  @media (max-width: 320px) {
    padding: 6px;
  }
`

export const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 180px;
  flex: 1;
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    min-width: 150px;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    margin-bottom: 10px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 8px;
  }
`

export const BlinkingLight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  animation: blink 1s infinite;
  margin: 0 auto;

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
  
  @media (max-width: 360px) {
    width: 6px;
    height: 6px;
  }
`

export const ResultsInfo = styled.div`
  text-align: center;
  margin: 15px 0;
  color: ${textColor};
  font-weight: 500;
  font-size: 15px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin: 12px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin: 10px 0;
  }
  
  @media (max-width: 360px) {
    font-size: 12px;
  }
`

export const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: end;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 15px;
    flex-direction: column;
    align-items: stretch;
  }
`

export const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: end;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 15px;
    flex-direction: column;
    align-items: stretch;
  }
`

// Fully responsive filter container that scrolls horizontally on small screens
export const ResponsiveFilterContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(180px, 1fr);
  gap: 15px;
  align-items: end;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 5px;
  box-sizing: border-box;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${accentColor};
    border-radius: 3px;
  }
  
  @media (max-width: 1024px) {
    grid-auto-columns: minmax(150px, 1fr);
    gap: 12px;
  }
  
  @media (max-width: 768px) {
    grid-auto-columns: minmax(120px, 1fr);
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    grid-auto-flow: row;
    grid-auto-columns: unset;
    grid-template-columns: 1fr;
    overflow-x: visible;
  }
`

export const ResponsiveTableWrapper = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 1024px) {
    max-height: 450px;
  }
  
  @media (max-width: 768px) {
    max-height: 400px;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    max-height: 350px;
    border-radius: 4px;
  }

  @media (max-width: 360px) {
    max-height: 300px;
  }
`

export const MobileCard = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 6px;
  }
  
  @media (max-width: 360px) {
    padding: 10px;
    margin-bottom: 10px;
  }
`

export const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  box-sizing: border-box;
  
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    padding: 6px 0;
    font-size: 12px;
  }
  
  @media (max-width: 360px) {
    padding: 5px 0;
    font-size: 11px;
  }
`

export const MobileCardLabel = styled.span`
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.8rem;
  }
`

export const MobileCardValue = styled.span`
  color: #333;
  font-size: 0.9rem;
  text-align: right;
  max-width: 60%;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.8rem;
  }
`

export const DesktopTable = styled.div`
  display: block;
  width: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`

export const MobileCardContainer = styled.div`
  display: none;
  width: 100%;
  
  @media (max-width: 768px) {
    display: block;
  }
`

export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  background-color: ${props => props.color};
  color: white;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 3px 10px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 360px) {
    padding: 3px 8px;
    font-size: 0.75rem;
  }
`

export const InfoText = styled.div`
  text-align: center;
  margin: 10px 0;
  font-weight: 500;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 8px 0;
  }
  
  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
`

export const ResponsiveButton = styled(Button)`
  white-space: nowrap;
  width: auto;

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.95rem;
    width: auto;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.9rem;
    width: 100%;
  }
  
  @media (max-width: 360px) {
    padding: 9px 12px;
    font-size: 0.85rem;
  }
`

export const ActionCell = styled(TableCell)`
  padding: 8px;
  min-width: 220px;
  
  @media (max-width: 1024px) {
    min-width: 180px;
    padding: 6px;
  }
  
  @media (max-width: 768px) {
    min-width: 160px;
    padding: 5px;
  }

  @media (max-width: 480px) {
    min-width: 140px;
    padding: 4px;
  }
  
  @media (max-width: 360px) {
    min-width: 120px;
    padding: 3px;
  }
`

export const StatusSelect = styled(Select)`
  color: ${props => props.statusColor || '#333'};
  font-weight: 600;
  border: 2px solid ${props => props.statusColor || '#ccc'};
  padding: 5px 8px;
  border-radius: 4px;
  min-width: 140px;
  max-width: 100%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  margin-bottom: 0;
  
  @media (max-width: 992px) {
    min-width: 120px;
    font-size: 12px;
    padding: 5px 6px;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    font-size: 11px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 5px;
  }
  
  @media (max-width: 360px) {
    font-size: 9px;
    padding: 4px;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    gap: 5px;
  }

  @media (max-width: 768px) {
    gap: 4px;
  }

  @media (max-width: 480px) {
    gap: 3px;
    flex-direction: column;
  }
`

export const EditButton = styled(Button)`
  min-width: 50px;
  padding: 6px 10px;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
  
  @media (max-width: 992px) {
    min-width: 45px;
    padding: 6px 8px;
    font-size: 11px;
  }
  
  @media (max-width: 768px) {
    min-width: 40px;
    padding: 5px 6px;
    font-size: 10px;
  }

  @media (max-width: 480px) {
    min-width: 100%;
    padding: 6px;
    font-size: 10px;
  }
  
  @media (max-width: 360px) {
    padding: 5px;
    font-size: 9px;
  }
`