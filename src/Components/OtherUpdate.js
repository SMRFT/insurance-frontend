"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import {
  FormWrapper,
  FilterWrapper,
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  SearchContainer,
  FilterContainer,
  Label,
  Button,
} from "./SharedStyledComponents"

const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"

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

const ResultsInfo = styled.div`
  text-align: center;
  margin: 10px 0;
  color: ${textColor};
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`

const OtherUpdate = () => {
  const [otherData, setOtherData] = useState([])
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
  }, [fromDate, toDate])

  // Filter data when search parameters change
  useEffect(() => {
    filterData()
  }, [otherData, selectedCompany, searchField, searchValue])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()

      if (fromDate) {
        params.append("from_date", fromDate.toLocaleDateString("en-CA"))
      }

      if (toDate) {
        params.append("to_date", toDate.toLocaleDateString("en-CA"))
      }

      const url = `${Insurancebaseurl}other_records/?${params.toString()}`
      console.log("Fetching data from:", url)

      const response = await fetch(url)
      const data = await response.json()

      console.log("Fetched data:", data)
      setOtherData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setOtherData([])
    }
  }

  const filterData = () => {
    let filtered = [...otherData]

    // Filter by company
    if (selectedCompany) {
      filtered = filtered.filter((item) => item.company_name === selectedCompany)
    }

    // Filter by search field and value
    if (searchField && searchValue) {
      filtered = filtered.filter((item) => {
        const fieldValue = item[searchField]
        if (fieldValue) {
          return fieldValue.toLowerCase().includes(searchValue.toLowerCase())
        }
        return false
      })
    }

    setFilteredData(filtered)
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
    console.log("Editing item:", item)

    // Prepare the item data with proper ID format
    const editItem = {
      ...item,
      // Ensure we have the ID in the right format
      id: item.id || item._id,
      _id: item.id || item._id,
    }

    console.log("Navigating with edit item:", editItem)

    navigate("/OtherForm", {
      state: editItem,
    })
  }

  // Calculate total amount for each record
  const calculateTotalAmount = (paymentDetails) => {
    if (!paymentDetails || !Array.isArray(paymentDetails)) return 0
    return paymentDetails.reduce((total, payment) => total + (Number.parseFloat(payment.amount) || 0), 0)
  }

  // Get payment methods for display
  const getPaymentMethods = (paymentDetails) => {
    if (!paymentDetails || !Array.isArray(paymentDetails)) return "N/A"
    return paymentDetails.map((payment) => payment.payment_method).join(", ")
  }

  return (
    <FormWrapper>
      <ReportContainer>
        <Title>Other Records Update</Title>
        <FilterContainer>
          <FilterWrapper>
            <Label htmlFor="companyName">Filter by Company:</Label>
            <FormControl id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
              <option value="">Select Company</option>
              <option value="ESI">ESI</option>
              <option value="ESIC">ESIC</option>
              <option value="General Insurance">General Insurance</option>
              <option value="ECHS">ECHS</option>
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
              <option value="patient_name">Patient Name</option>
              <option value="patient_uhid">Patient UHID</option>
              <option value="mobile_number">Mobile Number</option>
              <option value="treatment">Treatment</option>
            </FormControl>
          </FilterWrapper>

          {searchField && (
            <SearchContainer>
              <Label>Search Value:</Label>
              <SearchInput
                type="text"
                value={searchValue}
                onChange={handleSearchValueChange}
                placeholder={`Enter ${searchField.replace(/_/g, " ").toLowerCase()}`}
              />
            </SearchContainer>
          )}
        </FilterContainer>

        <ResultsInfo>Showing {filteredData.length} result(s)</ResultsInfo>

        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Patient Name</TableHeader>
                <TableHeader>Patient UHID</TableHeader>
                <TableHeader>Mobile Number</TableHeader>
                <TableHeader>Company Name</TableHeader>
                <TableHeader>Treatment</TableHeader>
                <TableHeader>Total Amount</TableHeader>
                <TableHeader>Payment Methods</TableHeader>
                <TableHeader>Refund</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={item.id?.$oid || item.id || index}>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{item.date || "N/A"}</TableCell>
                    <TableCell>{item.patient_name || "N/A"}</TableCell>
                    <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                    <TableCell>{item.mobile_number || "N/A"}</TableCell>
                    <TableCell>{item.company_name || "N/A"}</TableCell>
                    <TableCell>{item.treatment || "N/A"}</TableCell>
                    <TableCell>₹{calculateTotalAmount(item.payment_details).toFixed(2)}</TableCell>
                    <TableCell>{getPaymentMethods(item.payment_details)}</TableCell>
                    <TableCell>₹{item.refund || "0"}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(item)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
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
      </ReportContainer>
    </FormWrapper>
  )
}

export default OtherUpdate
