"use client"

import { useEffect, useState } from "react"
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
  FilterContainer,
  Label,
  Button,
  FormControl,
  SearchInput,
  ScrollableTableContainer,
  StyledDatePicker,
  Container,
} from "./SharedStyledComponents"

import apiRequest from "./ApiRequest"

const OtherCollect = () => {
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date())
  const [toDate, setToDate] = useState(() => new Date())
  const [collectedRecords, setCollectedRecords] = useState(new Set())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL
  const navigate = useNavigate()

  useEffect(() => {
    if (fromDate && toDate) {
      fetchRecords()
    }
  }, [fromDate, toDate])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, selectedCompany])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const params = {}
      if (fromDate) {
        params.from_date = fromDate.toLocaleDateString("en-CA")
      }
      if (toDate) {
        params.to_date = toDate.toLocaleDateString("en-CA")
      }
      params.status = "Approved"

      const url = `${Insurancebaseurl}other_records/`

      const response = await apiRequest(url, "GET", null, {}, { params })

      if (response.success && Array.isArray(response.data)) {
        const processedRecords = []
        response.data.forEach((record) => {
          if (record.payment_details && Array.isArray(record.payment_details) && record.payment_details.length > 0) {
            record.payment_details.forEach((payment) => {
              processedRecords.push({
                id: record.id || record._id,
                original_id: record.id || record._id,
                date: payment.date || record.date,
                patient_name: record.patient_name,
                patient_uhid: record.patient_uhid,
                mobile_number: record.mobile_number,
                company_name: record.company_name,
                treatment: record.treatment,
                amount: payment.amount,
                payment_method: payment.payment_method,
                refund: record.refund || 0,
                status: record.status || "Approved",
                originalRecord: record,
              })
            })
          }
        })

        const uniqueRecords = processedRecords.filter(
          (record, index, self) =>
            index ===
            self.findIndex(
              (r) =>
                r.original_id === record.original_id &&
                r.date === record.date &&
                r.amount === record.amount &&
                r.payment_method === record.payment_method,
            ),
        )

        setRecords(uniqueRecords)
      } else {
        setRecords([])
      }
    } catch (error) {
      setRecords([])
      console.error("Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...records]

    if (selectedCompany) {
      filtered = filtered.filter((record) => record.company_name === selectedCompany)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.patient_uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.mobile_number?.includes(searchTerm) ||
          record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredRecords(filtered)
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

  const handleCollect = async (record) => {
    try {
      const updatePayload = {
        id: record.original_id || record.id,
        status: "Collected",
      }

      const response = await apiRequest(`${Insurancebaseurl}other_records/`, "PUT", updatePayload)

      if (response.success || response.status === 200) {
        setCollectedRecords((prev) => new Set([...prev, record.original_id || record.id]))
        setTimeout(() => fetchRecords(), 500)
      }
    } catch (error) {
      console.error("Error collecting record:", error)
    }
  }

  return (
    <ReportContainer>
      <Container>
        <Title>Other Records - Collect Approved Items</Title>
        <FilterContainer
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <Label>Search</Label>
            <SearchInput
              type="text"
              placeholder="Search by name, UHID, mobile, treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
          <div>
            <Label>From Date</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select from date"
              isClearable
            />
          </div>
          <div>
            <Label>To Date</Label>
            <StyledDatePicker
              selected={toDate}
              onChange={handleToDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              isClearable
              minDate={fromDate}
            />
          </div>
        </FilterContainer>

        <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "500" }}>
          Showing {filteredRecords.length} approved payment record(s)
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <ScrollableTableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Patient Name</TableHeader>
                  <TableHeader>UHID</TableHeader>
                  <TableHeader>Mobile</TableHeader>
                  <TableHeader>Company</TableHeader>
                  <TableHeader>Treatment</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Payment Method</TableHeader>
                  <TableHeader>Refund</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => {
                    const isCollected = collectedRecords.has(record.original_id || record.id)
                    return (
                      <TableRow key={`${record.original_id}-${record.date}-${record.amount}-${index}`}>
                        <TableCell style={{ whiteSpace: "nowrap" }}>{record.date}</TableCell>
                        <TableCell>{record.patient_name}</TableCell>
                        <TableCell>{record.patient_uhid}</TableCell>
                        <TableCell>{record.mobile_number}</TableCell>
                        <TableCell>{record.company_name}</TableCell>
                        <TableCell>{record.treatment}</TableCell>
                        <TableCell>₹{Number.parseFloat(record.amount || 0).toFixed(2)}</TableCell>
                        <TableCell>{record.payment_method}</TableCell>
                        <TableCell>₹{Number.parseFloat(record.refund || 0).toFixed(2)}</TableCell>
                        <TableCell style={{ fontWeight: "600", color: "#2196f3" }}>
                          {record.status === "Collected" ? "Collected" : record.status === "Gate Pass Issued" ? "Gate Pass Issued" : "Approved"}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleCollect(record)}
                            disabled={isCollected}
                            style={{
                              backgroundColor: isCollected ? "#ccc" : "#2196f3",
                              cursor: isCollected ? "not-allowed" : "pointer",
                            }}
                          >
                            {isCollected ? "✓ Collected" : "Collect"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                      No approved records found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
              {filteredRecords.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
                    <TableCell colSpan="6" style={{ textAlign: "right" }}>
                      GRAND TOTAL:
                    </TableCell>
                    <TableCell>
                      ₹
                      {filteredRecords
                        .reduce((sum, record) => sum + (Number.parseFloat(record.amount) || 0), 0)
                        .toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </tr>
                </tfoot>
              )}
            </Table>
          </ScrollableTableContainer>
        )}
      </Container>
    </ReportContainer>
  )
}

export default OtherCollect
