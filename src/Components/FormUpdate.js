import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const primaryColor = "#6F8B83";
const backgroundColor = "#F9F9F9";
const textColor = "#333";
const accentColor = "#9aaea9";

const Container = styled.div`
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor});
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1100px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
`;

const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 30px;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
`;

const FilterContainer = styled.div`
  margin: 20px auto; /* Centers the container horizontally */
  display: flex;
  justify-content: center; /* Centers child elements within the container */
  align-items: center; /* Vertically centers child elements */
  gap: 20px; /* Adds spacing between the filters */
  flex-wrap: wrap; /* Ensures elements wrap to the next line if screen space is limited */
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the label and control within the wrapper */
  width: 200px; /* Ensures both filters have the same width */
`;

const FormControl = styled.select`
  width: 100%; /* Makes the dropdown full width of its container */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%; /* Makes the date picker full width of its container */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  font-family: 'Roboto', sans-serif;
  display: block; /* Ensure label is on a separate line from the input */
`;

const Select = styled.select`
  padding: 8px;
  margin: 0 10px;
  border-radius: 5px;
  border: 1px solid ${accentColor};
  font-size: 14px;
`;

const ScrollableTableContainer = styled.div`
  max-height: 440px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid ${accentColor};
  border-radius: 10px;
  background-color: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background-color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
`;

const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px;
  text-align: center;
  border: 1px solid ${accentColor};
  position: sticky;
  top: 0;
  z-index: 1;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(111, 139, 131, 0.2);
    transition: background-color 0.3s ease;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  color: ${textColor};
  border: 1px solid ${accentColor};
  text-align: center;
  word-break: break-word;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 5px 15px;
  border: none;
  background-color: ${primaryColor};
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  
  &:hover {
    background-color: ${accentColor};
  }
`;

const FormUpdate = () => {
  const [insuranceData, setInsuranceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;
  
  const navigate = useNavigate(); // Initialize the navigate hook

    useEffect(() => {
      if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-CA'); // "YYYY-MM-DD" format (ISO)
        fetch(`${Insurancebaseurl}insurance/?companyName=${selectedCompany}&date=${formattedDate}`)
          .then((response) => response.json())
          .then((data) => {
            setInsuranceData(data);
            filterData(data, selectedCompany);
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    }, [selectedCompany, selectedDate]);

    const handleDateChange = (date) => {
        console.log('Selected date:', date);  // Ensure it logs the Date object
        setSelectedDate(date);
      };      

  const filterData = (data, company) => {
    if (company) {
      const filtered = data.filter((item) => item.companyName === company);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleCompanyFilterChange = (event) => {
    const selected = event.target.value;
    setSelectedCompany(selected);
    filterData(insuranceData, selected); // Filter the data when the company is changed
  };

  const handleEdit = (item) => {
    navigate("/InsuranceForm", {
      state: {
        ...item  // Pass all properties from the item
      }
    });
  };

  return (
    <Container>
      <Title>Form Update</Title>
      <FilterContainer>
      <FilterWrapper>
        <Label htmlFor="companyName">Filter by Company:</Label>
        <FormControl
          id="companyName"
          value={selectedCompany}
          onChange={handleCompanyFilterChange}
        >
          <option value="">Select Company</option>
          <option value="General Insurance">General Insurance</option>
          <option value="ECHS">ECHS</option>
          <option value="ESI">ESI</option>
          <option value="Railway CTSE">Railway CTSE</option>
          <option value="TNCM">TNCM</option>
          <option value="TKT">TKT</option>
          <option value="FCA">FCA</option>
        </FormControl>
      </FilterWrapper>
      <FilterWrapper>
        <Label>Select Date:</Label>
        <StyledDatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
      </FilterWrapper>
    </FilterContainer>
      <ScrollableTableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Patient UHID</TableHeader>
              <TableHeader>Patient Name</TableHeader>
              <TableHeader>Bill Number</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Company Name</TableHeader>
              <TableHeader>Date of Discharge</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                <TableCell>{item.patient_name || "N/A"}</TableCell>
                <TableCell>{item.billNumber || "N/A"}</TableCell>
                <TableCell style={{whiteSpace:"nowrap"}}>{item.date || "N/A"}</TableCell>
                <TableCell>{item.companyName || "N/A"}</TableCell>
                <TableCell>{item.dateOfDischarge || "N/A"}</TableCell>
                <TableCell><Button onClick={() => handleEdit(item)}>Edit</Button></TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </ScrollableTableContainer>
    </Container>
  );
};

export default FormUpdate;
