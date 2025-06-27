"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"

const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"

const Container = styled.div`
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor});
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`

const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 30px;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`

const FilterContainer = styled.div`
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  flex-wrap: wrap;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    gap: 10px;
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    padding: 10px;
  }
`

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  
  @media (max-width: 768px) {
    min-width: 120px;
  }
  
  @media (max-width: 480px) {
    min-width: 100px;
  }
`

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  
  @media (max-width: 768px) {
    min-width: 150px;
  }
  
  @media (max-width: 480px) {
    min-width: 120px;
  }
`

const FormControl = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 2px ${primaryColor}30;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 2px ${primaryColor}30;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 2px ${primaryColor}30;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 8px;
  }
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  font-family: 'Roboto', sans-serif;
  display: block;
  margin-bottom: 5px;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const ScrollableTableContainer = styled.div`
  max-height: 440px;
  overflow-y: auto;
  overflow-x: auto;
  scrollbar-width: thin;
  border: 1px solid ${accentColor};
  border-radius: 10px;
  background-color: #fff;
  
  @media (max-width: 768px) {
    max-height: 350px;
  }
  
  @media (max-width: 480px) {
    max-height: 300px;
  }
`

const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  margin: 0;
  background-color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    min-width: 700px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    min-width: 600px;
  }
`

const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px 8px;
  text-align: center;
  border: 1px solid ${accentColor};
  position: sticky;
  top: 0;
  z-index: 5;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    padding: 10px 6px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 4px;
    font-size: 11px;
  }
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(111, 139, 131, 0.2);
    transition: background-color 0.3s ease;
  }
`

const TableCell = styled.td`
  padding: 12px 8px;
  color: ${textColor};
  border: 1px solid ${accentColor};
  text-align: center;
  word-break: break-word;
  line-height: 1.6;
  max-width: 150px;
  
  @media (max-width: 768px) {
    padding: 10px 6px;
    max-width: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 4px;
    max-width: 100px;
  }
`

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
  
  @media (max-width: 480px) {
    padding: 4px 12px;
    font-size: 12px;
  }
`

const ResultsInfo = styled.div`
  text-align: center;
  margin: 10px 0;
  color: ${textColor};
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`

const FormUpdate = () => {
  const [insuranceData, setInsuranceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [searchField, setSearchField] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  const navigate = useNavigate()

  // Fetch data when filters change
  useEffect(() => {
    fetchData()
  }, [selectedCompany, fromDate, toDate, searchField, searchValue])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()

      if (selectedCompany) {
        params.append("companyName", selectedCompany)
      }

      if (fromDate) {
        params.append("from_date", fromDate.toLocaleDateString("en-CA"))
      }

      if (toDate) {
        params.append("to_date", toDate.toLocaleDateString("en-CA"))
      }

      if (searchField && searchValue) {
        params.append("search_field", searchField)
        params.append("search_value", searchValue)
      }

      const url = `${Insurancebaseurl}insurance/?${params.toString()}`
      console.log("Fetching data from:", url)

      const response = await fetch(url)
      const data = await response.json()

      setInsuranceData(data)
      setFilteredData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setInsuranceData([])
      setFilteredData([])
    }
  }

  const handleCompanyFilterChange = (event) => {
    setSelectedCompany(event.target.value)
  }

  const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
  }

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value)
    setSearchValue("") // Clear search value when field changes
  }

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleEdit = (item) => {
    navigate("/InsuranceForm", {
      state: {
        ...item,
      },
    })
  }

  return (
    <Container>
      <Title>Form Update</Title>
      <FilterContainer>
        <FilterWrapper>
          <Label htmlFor="companyName">Filter by Company:</Label>
          <FormControl id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
            <option value="">Select Company</option>
            <option value="General Insurance">General Insurance</option>
            <option value="ECHS">ECHS</option>
            <option value="ESI">ESI</option>
            <option value="ESIC">ESIC</option>
            <option value="Railway CTSE">Railway CTSE</option>
            <option value="TKT">TKT</option>
            <option value="FCI">FCI</option>
            <option value="Airport">Airport</option>
          </FormControl>
        </FilterWrapper>

        <FilterWrapper>
          <Label>From Date:</Label>
          <StyledDatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select from date"
            isClearable
            popperProps={{
              strategy: "fixed",
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 10],
                  },
                },
              ],
            }}
            popperClassName="date-picker-popper"
          />
        </FilterWrapper>

        <FilterWrapper>
          <Label>To Date:</Label>
          <StyledDatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select to date"
            isClearable
            minDate={fromDate}
            popperProps={{
              strategy: "fixed",
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 10],
                  },
                },
              ],
            }}
            popperClassName="date-picker-popper"
          />
    
        </FilterWrapper>

        <FilterWrapper>
          <Label>Search by:</Label>
          <FormControl value={searchField} onChange={handleSearchFieldChange}>
            <option value="">Select Search Field</option>
            <option value="billNumber">Bill Number</option>
            <option value="ipNumber">IP Number</option>
            <option value="opNumber">OP Number</option>
            <option value="patient_name">Patient Name</option>
            <option value="dateOfDischarge">Discharge Date</option>
          </FormControl>
        </FilterWrapper>

        {searchField && (
          <SearchWrapper>
            <Label>Search Value:</Label>
            <SearchInput
              type={searchField === "dateOfDischarge" ? "date" : "text"}
              value={searchValue}
              onChange={handleSearchValueChange}
              placeholder={`Enter ${searchField.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            />
          </SearchWrapper>
        )}
       <div>
          <Button onClick={() => navigate("/InsuranceForm")}>Add New Record</Button>
        </div>    
      </FilterContainer>

      <ResultsInfo>Showing {filteredData.length} result(s)</ResultsInfo>

      <ScrollableTableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Patient UHID</TableHeader>
              <TableHeader>Patient Name</TableHeader>
              <TableHeader>Bill Number</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Company Name</TableHeader>
              <TableHeader>OP Number</TableHeader>
              <TableHeader>IP Number</TableHeader>
              <TableHeader>Date of Discharge</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                  <TableCell>{item.patient_name || "N/A"}</TableCell>
                  <TableCell>{item.billNumber || "N/A"}</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>{item.date || "N/A"}</TableCell>
                  <TableCell>{item.companyName || "N/A"}</TableCell>
                  <TableCell>{item.opNumber || "N/A"}</TableCell>
                  <TableCell>{item.ipNumber || "N/A"}</TableCell>
                  <TableCell>{item.dateOfDischarge || "N/A"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(item)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  No records found matching the current filters
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      </ScrollableTableContainer>

      <style jsx global>{`
        .date-picker-popper {
          z-index: 9999 !important;
        }
        
        .react-datepicker-popper {
          z-index: 9999 !important;
        }
        
        .react-datepicker {
          z-index: 9999 !important;
        }
      `}</style>
    </Container>
  )
}

export default FormUpdate
