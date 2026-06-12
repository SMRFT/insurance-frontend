import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import {
  FilterWrapper,
  Container,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FormControl,
  Label,
  Button,
  SearchWrapper,
  SearchInput,
  ResultsInfo,
  BlinkingLight,
  FilterContainer,
  ScrollableTableContainer,
  StyledDatePicker,
  ReportContainer
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#6F8B83"
const accentColor = "#9aaea9"

const InsuranceReport = () => {
  const [insuranceData, setInsuranceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [searchField, setSearchField] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => {
    fetchData()
  }, [selectedCompany, fromDate, toDate, searchField, searchValue])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCompany) params.append("companyName", selectedCompany)
      if (fromDate)        params.append("from_date", fromDate.toLocaleDateString("en-CA"))
      if (toDate)          params.append("to_date", toDate.toLocaleDateString("en-CA"))

      const url = `${Insurancebaseurl}insurance/?${params.toString()}`
      const result = await apiRequest(url, "GET")

      if (result.success) {
        setInsuranceData(result.data)
        setFilteredData(applyLocalFilters(result.data))
      } else {
        console.error("API error fetching data:", result.error)
        setInsuranceData([])
        setFilteredData([])
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setInsuranceData([])
      setFilteredData([])
    }
  }

  const applyLocalFilters = (data) => {
    if (!searchField || !searchValue) return data
    return data.filter((item) => {
      const fieldValue = item[searchField]
      if (searchValue.toLowerCase() === "n/a") {
        return !fieldValue || fieldValue === "" || fieldValue === "N/A"
      }
      if (searchField === "dateOfDischarge" && fieldValue) {
        return fieldValue.includes(searchValue)
      }
      if (fieldValue) {
        return fieldValue.toString().toLowerCase().includes(searchValue.toLowerCase())
      }
      return false
    })
  }

  const handleCompanyFilterChange  = (e) => setSelectedCompany(e.target.value)
  const handleFromDateChange        = (date) => setFromDate(date)
  const handleToDateChange          = (date) => setToDate(date)
  const handleSearchFieldChange     = (e) => { setSearchField(e.target.value); setSearchValue("") }
  const handleSearchValueChange     = (e) => setSearchValue(e.target.value)

  const handleViewFile = (fileId) => {
    window.open(`${Insurancebaseurl}insurance/serve_file/${fileId}`, "_blank")
  }

  const exportToExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Patient UHID": item.patient_uhid || "N/A",
      "Patient Name": item.patient_name || "N/A",
      Date: item.date || "N/A",
      "IP/OP Number": item.opNumber || item.ipNumber || "N/A",
      "Bill Number": item.billNumber || "N/A",
      "Bill Amount": item.billAmount || "N/A",
      "Company Name": item.companyName || "N/A",
      "Date of Discharge": item.dateOfDischarge || "N/A",
      "Submission Status": item.submissionStatus || "N/A",
      "Approval Amount": item.approvalAmount || "N/A",
      "Claimed Amount": item.claimedAmount || "N/A",
      "Settled Amount": item.settledAmount || "N/A",
      Approval: item.approval || "N/A",
      "Follow-Up": item.followUp || "N/A",
      "Reason Not Match": item.reasonNotMatch || "N/A",
      "Claim Option": item.claimOption || "N/A",
      "Claim Details": item.claimDetails || "N/A",
      "Not Claim Reason": item.notClaimReason || "N/A",
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    XLSX.utils.book_append_sheet(wb, ws, "Insurance Report")
    XLSX.writeFile(wb, `Insurance_Report_${new Date().toLocaleDateString("en-CA")}.xlsx`)
  }

  return (
    <ReportContainer>
      <Container>
        <Title>Insurance Report</Title>

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
              <option value="TNCM">TNCM</option>
              <option value="TKT">TKT</option>
              <option value="FCA">FCA</option>
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
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
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
              minDate={fromDate}
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
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

          <FilterWrapper>
            <Button onClick={exportToExcel}>Export to Excel</Button>
          </FilterWrapper>
        </FilterContainer>

        <ResultsInfo>Showing {filteredData.length} result(s)</ResultsInfo>

        {/* Single scroll container — no double-wrapper */}
        <ScrollableTableContainer>
          <Table className="frozen-columns-table">
            <thead>
              <tr>
                {/* ── Frozen cols ── */}
                <TableHeader className="frozen-col frozen-col-0">S.No</TableHeader>
                <TableHeader className="frozen-col frozen-col-1">Patient UHID</TableHeader>
                <TableHeader className="frozen-col frozen-col-2">Patient Name</TableHeader>
                {/* ── Scrollable cols ── */}
                <TableHeader>Date</TableHeader>
                <TableHeader>IP / OP Number</TableHeader>
                <TableHeader>Company Name</TableHeader>
                <TableHeader>Bill Number</TableHeader>
                <TableHeader>Bill Amount</TableHeader>
                <TableHeader>Billing File</TableHeader>
                <TableHeader>Date of Discharge</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Submission Status</TableHeader>
                <TableHeader>Query File</TableHeader>
                <TableHeader>Approval Amount</TableHeader>
                <TableHeader>Claim ID</TableHeader>
                <TableHeader>Claimed Amount</TableHeader>
                <TableHeader>Settled Amount</TableHeader>
                <TableHeader>Approval</TableHeader>
                <TableHeader>Follow-Up</TableHeader>
                <TableHeader>Reason Not Match</TableHeader>
                <TableHeader>Claim Option</TableHeader>
                <TableHeader>Claim Details</TableHeader>
                <TableHeader>Not Claim Reason</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    {/* ── Frozen cols ── */}
                    <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>{index + 1}</TableCell>
                    <TableCell className="frozen-col frozen-col-1">{item.patient_uhid || "N/A"}</TableCell>
                    <TableCell className="frozen-col frozen-col-2">{item.patient_name || "N/A"}</TableCell>
                    {/* ── Scrollable cols ── */}
                    <TableCell style={{ whiteSpace: "nowrap" }}>{item.date || "N/A"}</TableCell>
                    <TableCell>{item.opNumber || item.ipNumber || "N/A"}</TableCell>
                    <TableCell>{item.companyName || "N/A"}</TableCell>
                    <TableCell>{item.billNumber || "N/A"}</TableCell>
                    <TableCell>{item.billAmount || "N/A"}</TableCell>
                    <TableCell>
                      {item.billingFile && <Button onClick={() => handleViewFile(item.billingFile)}>View</Button>}
                    </TableCell>
                    <TableCell>{item.dateOfDischarge || "N/A"}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {item.submissionStatus === "Physical" && <BlinkingLight />}
                    </TableCell>
                    <TableCell>{item.submissionStatus || "N/A"}</TableCell>
                    <TableCell>
                      {item.queryUpload && <Button onClick={() => handleViewFile(item.queryUpload)}>View</Button>}
                    </TableCell>
                    <TableCell>{item.approvalAmount || "N/A"}</TableCell>
                    <TableCell>{item.claimId || "N/A"}</TableCell>
                    <TableCell>{item.claimedAmount || "N/A"}</TableCell>
                    <TableCell>{item.settledAmount || "N/A"}</TableCell>
                    <TableCell>{item.approval || "N/A"}</TableCell>
                    <TableCell>{item.followUp || "N/A"}</TableCell>
                    <TableCell>{item.reasonNotMatch || "N/A"}</TableCell>
                    <TableCell>{item.claimOption || "N/A"}</TableCell>
                    <TableCell>{item.claimDetails || "N/A"}</TableCell>
                    <TableCell>{item.notClaimReason || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="23" style={{ textAlign: "center", padding: "20px" }}>
                    No records found matching the current filters
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </ScrollableTableContainer>

        <style jsx global>{`
          /* ── Frozen column positions ─────────────────────────────── */
          .frozen-columns-table { position: relative; }

          .frozen-col {
            position: sticky !important;
            background-color: white;
            z-index: 10;
          }

          /* Col 0 — S.No */
          .frozen-col-0 { left: 0px;   min-width: 60px;  text-align: center; }

          /* Col 1 — Patient UHID */
          .frozen-col-1 { left: 60px;  min-width: 130px; }

          /* Col 2 — Patient Name (last frozen — shadow divider) */
          .frozen-col-2 {
            left: 190px;
            min-width: 140px;
            border-right: 2px solid #ddd;
          }
          .frozen-col-2::after {
            content: '';
            position: absolute;
            top: 0; right: -10px; bottom: 0;
            width: 10px;
            background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
            pointer-events: none;
          }

          /* ── Sticky header ───────────────────────────────────────── */
          thead tr th       { position: sticky !important; top: 0; z-index: 11; }
          thead .frozen-col { background-color: #6F8B83; position: sticky !important; top: 0; z-index: 20 !important; }

          /* ── Hover keeps frozen cols highlighted ─────────────────── */
          tbody tr:hover .frozen-col { background-color: rgba(111, 139, 131, 0.2); }

          /* ── DatePicker z-index ──────────────────────────────────── */
          .date-picker-popper      { z-index: 9999 !important; }
          .react-datepicker-popper { z-index: 9999 !important; }
          .react-datepicker        { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

export default InsuranceReport