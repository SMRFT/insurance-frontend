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
  ButtonWrapper,
  Button,
  ResponsiveTableWrapper,
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

  // Fetch data when filters change
  useEffect(() => {
    fetchData()
  }, [selectedCompany, fromDate, toDate, searchField, searchValue])

const fetchData = async () => {
  try {
    const params = new URLSearchParams();

    if (selectedCompany) {
      params.append("companyName", selectedCompany);
    }

    if (fromDate) {
      params.append("from_date", fromDate.toLocaleDateString("en-CA"));
    }

    if (toDate) {
      params.append("to_date", toDate.toLocaleDateString("en-CA"));
    }

    // searchField/searchValue will be handled locally
    const url = `${Insurancebaseurl}insurance/?${params.toString()}`;
    console.log("Fetching data from:", url);

    const result = await apiRequest(url, "GET");

    if (result.success) {
      setInsuranceData(result.data);

      // Apply local filtering
      const filtered = applyLocalFilters(result.data);
      setFilteredData(filtered);
    } else {
      console.error("API error fetching data:", result.error);
      setInsuranceData([]);
      setFilteredData([]);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    setInsuranceData([]);
    setFilteredData([]);
  }
};

// New function to handle local filtering including N/A values
const applyLocalFilters = (data) => {
  if (!searchField || !searchValue) {
    return data
  }

  return data.filter((item) => {
    const fieldValue = item[searchField]
    
    // Handle N/A search - check if the field is null, undefined, empty string, or already "N/A"
    if (searchValue.toLowerCase() === "n/a") {
      return !fieldValue || fieldValue === "" || fieldValue === "N/A"
    }
    
    // Handle date search
    if (searchField === "dateOfDischarge" && fieldValue) {
      return fieldValue.includes(searchValue)
    }
    
    // Handle regular text search (case-insensitive)
    if (fieldValue) {
      return fieldValue.toString().toLowerCase().includes(searchValue.toLowerCase())
    }
    
    return false
  })
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

const handleViewFile = (fileId) => {
  const fileUrl = `${Insurancebaseurl}insurance/serve_file/${fileId}`;
  window.open(fileUrl, "_blank");
};

  const exportToExcel = () => {
    // Prepare data for export (excluding file columns)
    const exportData = filteredData.map((item) => ({
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

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Insurance Report")

    // Generate filename with current date
    const today = new Date().toLocaleDateString("en-CA")
    const filename = `Insurance_Report_${today}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)
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

        <FilterWrapper>
            <Button onClick={exportToExcel}>Export to Excel</Button>
        </FilterWrapper>
      </FilterContainer>

      <ResultsInfo>Showing {filteredData.length} result(s)</ResultsInfo>

      <ResponsiveTableWrapper>
        <ScrollableTableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Patient UHID</TableHeader>
                <TableHeader>Patient Name</TableHeader>
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
                    <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                    <TableCell>{item.patient_name || "N/A"}</TableCell>
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
                    <TableCell>{item.claimId|| "N/A"}</TableCell>
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
                  <TableCell colSpan="21" style={{ textAlign: "center", padding: "20px" }}>
                    No records found matching the current filters
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </ScrollableTableContainer>
      </ResponsiveTableWrapper>

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
        
        /* Custom scrollbar styling */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${accentColor};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${primaryColor};
          }
        }
        
        /* Ensure body has proper margin for mobile */
        @media (max-width: 480px) {
          body {
            margin: 0;
            padding: 5px;
          }
        }
      `}</style>
    </Container>
    </ReportContainer>
  )
}

export default InsuranceReport