import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FormControl,
  Label,
  SearchInput,
  FilterWrapper,
  Button,
  ResultsInfo,
  SearchWrapper,
  FilterContainer,
  ScrollableTableContainer,
  StyledDatePicker,
  ReportContainer
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

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

  useEffect(() => {
    fetchData()
  }, [selectedCompany, fromDate, toDate, searchField, searchValue])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCompany)          params.append("companyName",   selectedCompany)
      if (fromDate)                 params.append("from_date",     fromDate.toLocaleDateString("en-CA"))
      if (toDate)                   params.append("to_date",       toDate.toLocaleDateString("en-CA"))
      if (searchField && searchValue) {
        params.append("search_field", searchField)
        params.append("search_value", searchValue)
      }

      const url = `${Insurancebaseurl}insurance/?${params.toString()}`
      const result = await apiRequest(url, "GET")

      if (result.success) {
        setInsuranceData(result.data)
        setFilteredData(result.data)
      } else {
        console.error("Error fetching data:", result.error)
        setInsuranceData([])
        setFilteredData([])
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setInsuranceData([])
      setFilteredData([])
    }
  }

  const handleCompanyFilterChange  = (e) => setSelectedCompany(e.target.value)
  const handleFromDateChange        = (date) => setFromDate(date)
  const handleToDateChange          = (date) => setToDate(date)
  const handleSearchFieldChange     = (e) => { setSearchField(e.target.value); setSearchValue("") }
  const handleSearchValueChange     = (e) => setSearchValue(e.target.value)

  const handleEdit = (item) => {
    navigate("/InsuranceForm", { state: { ...item } })
  }

  return (
    <ReportContainer>
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
              popperProps={{
                strategy: "fixed",
                modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
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
              minDate={fromDate}
              popperProps={{
                strategy: "fixed",
                modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
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
            <Button onClick={() => navigate("/")}>Add New Record</Button>
          </div>
        </FilterContainer>

        <ResultsInfo>Showing {filteredData.length} result(s)</ResultsInfo>

        {/* ── Table with first 3 columns frozen ── */}
        <ScrollableTableContainer>
          <Table className="frozen-columns-table">
            <thead>
              <tr>
                {/* Frozen */}
                <TableHeader className="frozen-col frozen-col-0">Patient UHID</TableHeader>
                <TableHeader className="frozen-col frozen-col-1">Patient Name</TableHeader>
                <TableHeader className="frozen-col frozen-col-2">Bill Number</TableHeader>
                {/* Scrollable */}
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
                    {/* Frozen */}
                    <TableCell className="frozen-col frozen-col-0">{item.patient_uhid  || "N/A"}</TableCell>
                    <TableCell className="frozen-col frozen-col-1">{item.patient_name  || "N/A"}</TableCell>
                    <TableCell className="frozen-col frozen-col-2">{item.billNumber    || "N/A"}</TableCell>
                    {/* Scrollable */}
                    <TableCell style={{ whiteSpace: "nowrap" }}>{item.date            || "N/A"}</TableCell>
                    <TableCell>{item.companyName      || "N/A"}</TableCell>
                    <TableCell>{item.opNumber         || "N/A"}</TableCell>
                    <TableCell>{item.ipNumber         || "N/A"}</TableCell>
                    <TableCell>{item.dateOfDischarge  || "N/A"}</TableCell>
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
          /* ── Frozen column positions ───────────────────────────────────── */
          .frozen-columns-table { position: relative; }

          .frozen-col {
            position: sticky !important;
            background-color: white;
            z-index: 10;
          }

          /* Col 0 — Patient UHID */
          .frozen-col-0 { left: 0px;   min-width: 120px; }

          /* Col 1 — Patient Name */
          .frozen-col-1 { left: 120px; min-width: 140px; }

          /* Col 2 — Bill Number (last frozen — shadow divider) */
          .frozen-col-2 {
            left: 260px;
            min-width: 120px;
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

          /* ── Sticky header: all th stay on top ─────────────────────────── */
          thead tr th          { position: sticky !important; top: 0; z-index: 11; }
          thead .frozen-col    { background-color: #6F8B83;   position: sticky !important; top: 0; z-index: 20 !important; }

          /* ── Hover keeps frozen cols highlighted ────────────────────────── */
          tbody tr:hover .frozen-col { background-color: rgba(111, 139, 131, 0.2); }

          /* ── DatePicker z-index ─────────────────────────────────────────── */
          .date-picker-popper      { z-index: 9999 !important; }
          .react-datepicker-popper { z-index: 9999 !important; }
          .react-datepicker        { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

export default FormUpdate