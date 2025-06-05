"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker"
import styled from "styled-components" // Import styled-components
import "react-datepicker/dist/react-datepicker.css"

// Update the color variables at the top of the file
const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"

// Styled components
const Container = styled.div`
  font-family: Arial, sans-serif;
  margin: 20px;
`

const Title = styled.h1`
  text-align: center;
  color: #333;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`

const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px;
  text-align: center;
  border: 1px solid ${accentColor};
`

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`

const DatePickerWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 20px;
  justify-content: center;
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

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${primaryColor};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${accentColor};
  }
`

const DaycareReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [daycareData, setDaycareData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [fileUrl, setFileUrl] = useState(null)

   const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;

  const handleMonthChange = (date) => {
    setSelectedMonth(date)

    const filtered = daycareData.filter((daycare) => {
      const submissionDate = new Date(daycare.submissionDate)
      return submissionDate.getFullYear() === date.getFullYear() && submissionDate.getMonth() === date.getMonth()
    })

    setFilteredData(filtered)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)

    const filtered = daycareData.filter((daycare) => {
      const submissionDate = new Date(daycare.submissionDate)
      return submissionDate.toLocaleDateString() === date.toLocaleDateString()
    })

    setFilteredData(filtered)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Insurancebaseurl}submit-daycare/`)

        const processedData = response.data.map((daycare) => {
          const parsedAdmissionType =
            typeof daycare.admissionType === "string" ? JSON.parse(daycare.admissionType) : daycare.admissionType

          return { ...daycare, admissionType: parsedAdmissionType }
        })

        const currentMonth = new Date()
        const filteredCurrentMonthData = processedData.filter((daycare) => {
          const submissionDate = new Date(daycare.submissionDate)
          return (
            submissionDate.getFullYear() === currentMonth.getFullYear() &&
            submissionDate.getMonth() === currentMonth.getMonth()
          )
        })

        setDaycareData(processedData)
        setFilteredData(filteredCurrentMonthData)
      } catch (error) {
        console.error("Error fetching daycare data", error)
      }
    }

    fetchData()
  }, [])

  const handleViewFile = (fileId) => {
    // Construct file URL using the actual file ID
    const fileUrl = `${Insurancebaseurl}insurance/serve_file/${fileId}`
    window.open(fileUrl, "_blank")
  }

  return (
    <Container>
      <Title>Daycare Report</Title>
      <DatePickerWrapper>
        <div>
          <label>Select Month:</label>
          <DatePicker selected={selectedMonth} onChange={handleMonthChange} dateFormat="MM/yyyy" showMonthYearPicker />
        </div>
        <div>
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a Date"
          />
        </div>
      </DatePickerWrapper>
      <Table>
  <thead>
    <tr>
      <TableHeader>Patient Name</TableHeader>
      <TableHeader>UHID</TableHeader>
      <TableHeader>Doctor Name</TableHeader>
      <TableHeader>Bill Type</TableHeader>
      <TableHeader>Claim ID</TableHeader>
      <TableHeader>Submission Date</TableHeader>
      <TableHeader>Admission Type</TableHeader>
      <TableHeader>File</TableHeader>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((daycare, index) => (
      <TableRow key={index}>
        <TableCell>{daycare.patientName}</TableCell>
        <TableCell>{daycare.uhid}</TableCell>
        <TableCell>{daycare.doctorName}</TableCell>
        <TableCell>{daycare.billType}</TableCell>
        <TableCell>{daycare.claimId}</TableCell>
        <TableCell>{new Date(daycare.submissionDate).toLocaleDateString()}</TableCell>
        <TableCell>
          {daycare.admissionType.ipNumber
            ? `IP: ${daycare.admissionType.ipNumber}`
            : `OP: ${daycare.admissionType.opNumber}`}
        </TableCell>
        <TableCell>
          <Button onClick={() => handleViewFile(daycare.opFile)}>View</Button>
        </TableCell>
      </TableRow>
    ))}
  </tbody>
</Table>

    </Container>
  )
}

export default DaycareReport

