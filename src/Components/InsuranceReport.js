import { useEffect, useState, useCallback, useMemo } from "react"
import * as XLSX from "xlsx"
import { Eye, FileDown, Search, Filter, History } from "lucide-react"
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
  BlinkingLight,
  FilterContainer,
  ScrollableTableContainer,
  StyledDatePicker,
  ReportContainer,
  Spinner,
  LoadingSpinnerContainer,
  EmptyStateContainer,
  EmptyStateTitle,
  EmptyStateText,
  IconButton,
  ResultsInfo,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#4E7B6F"

const sortVoucherNumbers = (voucherStr) => {
  if (!voucherStr) return ""
  return voucherStr
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "")
    .sort((a, b) => {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b)
      if (isNaN(numA)) return 1
      if (isNaN(numB)) return -1
      return numA - numB
    })
    .join(", ")
}

const InsuranceReport = () => {
  const [insuranceData, setInsuranceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState("")
  const [ctseTypeFilter, setCtseTypeFilter] = useState("")
  const [fromDate, setFromDate] = useState(new Date())
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [activeHistory, setActiveHistory] = useState([])
  const [activeHistoryName, setActiveHistoryName] = useState("")

  const handleOpenHistoryModal = (history, name) => {
    setActiveHistory(history)
    setActiveHistoryName(name)
    setShowHistoryModal(true)
  }
  const [toDate, setToDate] = useState(new Date())
  const [searchField, setSearchField] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCompany) params.append("companyName", selectedCompany)
      if (fromDate) params.append("from_date", fromDate.toLocaleDateString("en-CA"))
      if (toDate) params.append("to_date", toDate.toLocaleDateString("en-CA"))

      const url = `${Insurancebaseurl}insurance/?${params.toString()}`
      const result = await apiRequest(url, "GET")

      if (result.success) {
        setInsuranceData(result.data)
      } else {
        console.error("API error fetching data:", result.error)
        setInsuranceData([])
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setInsuranceData([])
    } finally {
      setLoading(false)
    }
  }, [selectedCompany, fromDate, toDate, Insurancebaseurl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredData = useMemo(() => {
    let result = insuranceData

    if (selectedCompany === "Railway CTSE" && ctseTypeFilter && ctseTypeFilter !== "All") {
      result = result.filter(item => item.ctseType === ctseTypeFilter)
    }

    if (!searchField || !searchValue) return result
    return result.filter((item) => {
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
  }, [insuranceData, searchField, searchValue, selectedCompany, ctseTypeFilter])

  const totals = useMemo(() => {
    let gross = 0
    let tax = 0
    let net = 0
    let gst = 0
    filteredData.forEach((item) => {
      gross += parseFloat(item.grossAmount) || 0
      tax += parseFloat(item.taxAmount) || 0
      net += parseFloat(item.netAmount) || 0
      gst += parseFloat(item.gst) || 0
    })
    return { gross, tax, net, gst }
  }, [filteredData])

  const handleCompanyFilterChange = (e) => setSelectedCompany(e.target.value)
  const handleFromDateChange = (date) => setFromDate(date)
  const handleToDateChange = (date) => setToDate(date)
  const handleSearchFieldChange = (e) => { setSearchField(e.target.value); setSearchValue("") }
  const handleSearchValueChange = (e) => setSearchValue(e.target.value)

  const handleViewFile = (fileId) => {
    window.open(`${Insurancebaseurl}insurance/serve_file/${fileId}`, "_blank")
  }

  const exportToExcel = () => {
    const exportData = filteredData.map((item, index) => {
      if (selectedCompany === "Railway CTSE") {
        return {
          "S.No": index + 1,
          "Date": item.date || "N/A",
          "Patient Name": item.patient_name || "N/A",
          "Patient UHID": item.patient_uhid || "N/A",
          "IP Number": item.ipNumber || item.opNumber || "N/A",
          "Voucher Number": sortVoucherNumbers(item.voucherNumber) || "N/A",
          Referral: item.referral || "N/A",
          "CTSE Type": item.ctseType || "N/A",
          "Gross Amount": item.grossAmount || "N/A",
          "Tax Amount": item.taxAmount || "N/A",
          "Net Amount": item.netAmount || "N/A",
          GST: item.gst || "N/A",
        }
      }
      return {
        "S.No": index + 1,
        "Patient UHID": item.patient_uhid || "N/A",
        "Patient Name": item.patient_name || "N/A",
        Date: item.date || "N/A",
        "IP/OP Number": item.opNumber || item.ipNumber || "N/A",
        "Company Name": item.companyName || "N/A",
        "CTSE Type": item.ctseType || "N/A",
        "Bill Number": item.billNumber || "N/A",
        "Bill Amount": item.billAmount || "N/A",
        "Voucher Number": sortVoucherNumbers(item.voucherNumber) || "N/A",
        Referral: item.referral || "N/A",
        "Gross Amount": item.grossAmount || "N/A",
        "Tax Amount": item.taxAmount || "N/A",
        "Net Amount": item.netAmount || "N/A",
        GST: item.gst || "N/A",
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
      }
    })

    if (filteredData.length > 0) {
      if (selectedCompany === "Railway CTSE") {
        exportData.push({
          "S.No": "Total",
          "Date": "",
          "Patient Name": "",
          "Patient UHID": "",
          "IP Number": "",
          "Voucher Number": "",
          Referral: "",
          "CTSE Type": "",
          "Gross Amount": totals.gross,
          "Tax Amount": totals.tax,
          "Net Amount": totals.net,
          GST: totals.gst,
        })
      } else {
        exportData.push({
          "S.No": "Total",
          "Patient UHID": "",
          "Patient Name": "",
          Date: "",
          "IP/OP Number": "",
          "Company Name": "",
          "CTSE Type": "",
          "Bill Number": "",
          "Bill Amount": "",
          "Voucher Number": "",
          Referral: "",
          "Gross Amount": totals.gross,
          "Tax Amount": totals.tax,
          "Net Amount": totals.net,
          GST: totals.gst,
          "Date of Discharge": "",
          "Submission Status": "",
          "Approval Amount": "",
          "Claimed Amount": "",
          "Settled Amount": "",
          Approval: "",
          "Follow-Up": "",
          "Reason Not Match": "",
          "Claim Option": "",
          "Claim Details": "",
          "Not Claim Reason": "",
        })
      }
    }

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    XLSX.utils.book_append_sheet(wb, ws, "Insurance Report")
    XLSX.writeFile(wb, `Insurance_Report_${new Date().toLocaleDateString("en-CA")}.xlsx`)
  }

  return (
    <ReportContainer>
      <Container>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0, flexWrap: 'wrap', gap: '10px' }}>
          <Title style={{ margin: 0, textAlign: 'left' }}>Insurance Report</Title>
          <Button onClick={exportToExcel} style={{ display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}>
            <FileDown size={15} />
            Export to Excel
          </Button>
        </div>

        {/* ── Filters ── */}
        <FilterContainer>
          <FilterWrapper>
            <Label htmlFor="companyName">
              <Filter size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Company
            </Label>
            <FormControl id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
              <option value="">All Companies</option>
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

          {selectedCompany === "Railway CTSE" && (
            <FilterWrapper>
              <Label htmlFor="ctseTypeFilter">CTSE Type</Label>
              <FormControl id="ctseTypeFilter" value={ctseTypeFilter} onChange={(e) => setCtseTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="Pensionary">Pensionary</option>
                <option value="Regular">Regular</option>
                <option value="All">All</option>
              </FormControl>
            </FilterWrapper>
          )}

          <FilterWrapper>
            <Label>From Date</Label>
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
            <Label>To Date</Label>
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
            <Label>
              <Search size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Search By
            </Label>
            <FormControl value={searchField} onChange={handleSearchFieldChange}>
              <option value="">Select Field</option>
              <option value="billNumber">Bill Number</option>
              <option value="ipNumber">IP Number</option>
              <option value="opNumber">OP Number</option>
              <option value="patient_name">Patient Name</option>
              <option value="dateOfDischarge">Discharge Date</option>
            </FormControl>
          </FilterWrapper>

          {searchField && (
            <SearchWrapper>
              <Label>Search Value</Label>
              <SearchInput
                type={searchField === "dateOfDischarge" ? "date" : "text"}
                value={searchValue}
                onChange={handleSearchValueChange}
                placeholder={`Enter ${searchField.replace(/([A-Z])/g, " $1").toLowerCase()}`}
              />
            </SearchWrapper>
          )}
        </FilterContainer>

        {/* ── Results count ── */}
        <ResultsInfo>
          Showing <strong>{filteredData.length}</strong> record{filteredData.length !== 1 ? 's' : ''}
        </ResultsInfo>

        {/* ── Table ── */}
        <ScrollableTableContainer style={{ flex: 1, minHeight: 0 }}>
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
                <TableHeader>Provider</TableHeader>
                <TableHeader>Voucher Number</TableHeader>
                <TableHeader>Referral</TableHeader>
                <TableHeader>Gross Amount</TableHeader>
                <TableHeader>Tax Amount 10%</TableHeader>
                <TableHeader>Net Amount</TableHeader>
                <TableHeader>GST</TableHeader>
                <TableHeader>CTSE Type</TableHeader>
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
                <TableHeader style={{ textAlign: "center" }}>Edit History</TableHeader>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="32" style={{ padding: 0 }}>
                    <LoadingSpinnerContainer>
                      <Spinner />
                      <span>Loading report data...</span>
                    </LoadingSpinnerContainer>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                <>
                  {filteredData.map((item, index) => (
                    <TableRow key={index}>
                      {/* ── Frozen cols ── */}
                      <TableCell className="frozen-col frozen-col-0">{index + 1}</TableCell>
                      <TableCell className="frozen-col frozen-col-1">{item.patient_uhid || "N/A"}</TableCell>
                      <TableCell className="frozen-col frozen-col-2">{item.patient_name || "N/A"}</TableCell>
                      {/* ── Scrollable cols ── */}
                      <TableCell style={{ whiteSpace: "nowrap" }}>{item.date || "N/A"}</TableCell>
                      <TableCell>{item.opNumber || item.ipNumber || "N/A"}</TableCell>
                      <TableCell>{item.companyName || "N/A"}</TableCell>
                      <TableCell>{item.specificInsuranceCompany || "N/A"}</TableCell>
                      <TableCell>{sortVoucherNumbers(item.voucherNumber) || "N/A"}</TableCell>
                      <TableCell>{item.referral || "N/A"}</TableCell>
                      <TableCell>{item.grossAmount || "N/A"}</TableCell>
                      <TableCell>{item.taxAmount || "N/A"}</TableCell>
                      <TableCell>{item.netAmount || "N/A"}</TableCell>
                      <TableCell>{item.gst || "N/A"}</TableCell>
                      <TableCell>{item.ctseType || "N/A"}</TableCell>
                      <TableCell>{item.billNumber || "N/A"}</TableCell>
                      <TableCell>{item.billAmount || "N/A"}</TableCell>
                      <TableCell>
                        {item.billingFile ? (
                          <IconButton onClick={() => handleViewFile(item.billingFile)}>
                            <Eye size={13} /> View
                          </IconButton>
                        ) : "—"}
                      </TableCell>
                      <TableCell>{item.dateOfDischarge || "N/A"}</TableCell>
                      <TableCell>
                        {item.submissionStatus === "Physical" && <BlinkingLight />}
                      </TableCell>
                      <TableCell>{item.submissionStatus || "N/A"}</TableCell>
                      <TableCell>
                        {item.queryUpload ? (
                          <IconButton onClick={() => handleViewFile(item.queryUpload)}>
                            <Eye size={13} /> View
                          </IconButton>
                        ) : "—"}
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
                      <TableCell style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenHistoryModal(item.editHistory || [], item.patient_name || "N/A")}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            background: "#eef2f6",
                            color: "#334155",
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          <History size={12} /> View ({item.editHistory?.length || 0})
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedCompany === "Railway CTSE" && (
                    <TableRow style={{ fontWeight: "bold", backgroundColor: "#f3f4f6" }}>
                      <TableCell className="frozen-col frozen-col-0" style={{ fontWeight: "bold" }}>Total</TableCell>
                      <TableCell className="frozen-col frozen-col-1" style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell className="frozen-col frozen-col-2" style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>{totals.gross}</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>{totals.tax}</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>{totals.net}</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>{totals.gst}</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                      <TableCell style={{ fontWeight: "bold" }}></TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan="31" style={{ padding: 0 }}>
                    <EmptyStateContainer>
                      <Search size={40} strokeWidth={1.2} />
                      <EmptyStateTitle>No Records Found</EmptyStateTitle>
                      <EmptyStateText>
                        No insurance records match the selected filters. Try changing the date range, company, or search field.
                      </EmptyStateText>
                    </EmptyStateContainer>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollableTableContainer>

        <style>{`
          .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }
          .frozen-col { position: sticky !important; z-index: 10; background-color: #ffffff; outline: 1px solid #c8d8d4; }
          .frozen-col-0 { left: 0px;   min-width: 55px;  text-align: center; }
          .frozen-col-1 { left: 55px;  min-width: 130px; }
          .frozen-col-2 { left: 185px; min-width: 140px; box-shadow: 4px 0 8px -2px rgba(0,0,0,0.12); }
          thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: ${primaryColor}; }
          thead .frozen-col { background-color: ${primaryColor} !important; color: #fff; top: 0; z-index: 20 !important; outline: 1px solid #3A5C52; }
          tbody tr:nth-child(even) .frozen-col { background-color: #f5f8f7; }
          tbody tr:nth-child(odd)  .frozen-col { background-color: #ffffff; }
          tbody tr:hover .frozen-col { background-color: #e8f0ee !important; }
          .date-picker-popper, .react-datepicker-popper, .react-datepicker { z-index: 9999 !important; }
        `}</style>
        {showHistoryModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999
          }}>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "650px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "bold" }}>
                  Edit History - {activeHistoryName}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#64748b",
                    fontWeight: "bold"
                  }}
                >
                  &times;
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {activeHistory && activeHistory.length > 0 ? (
                  [...activeHistory].reverse().map((entry, idx) => (
                    <div key={idx} style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#f8fafc"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "8px", fontWeight: "500" }}>
                        <span>👤 {entry.edited_by_name || entry.edited_by || "System"}</span>
                        <span>📅 {entry.edited_date ? new Date(entry.edited_date).toLocaleString() : "N/A"}</span>
                      </div>
                      <div style={{
                        fontSize: "14px",
                        color: "#1e293b",
                        marginBottom: "12px",
                        fontStyle: "italic",
                        background: "#f1f5f9",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        borderLeft: "3px solid #6f8b83"
                      }}>
                        <strong>Reason: </strong> {entry.edited_reason || "No reason provided"}
                      </div>
                      {entry.changes && entry.changes.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginTop: "8px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#e2e8f0" }}>
                              <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", textAlign: "left" }}>Field</th>
                              <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", textAlign: "left" }}>Before</th>
                              <th style={{ border: "1px solid #cbd5e1", padding: "6px 8px", textAlign: "left" }}>After</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.changes.map((change, cIdx) => (
                              <tr key={cIdx} style={{ backgroundColor: "white" }}>
                                <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px", fontWeight: "600", color: "#475569" }}>{change.field}</td>
                                <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px", color: "#b91c1c", backgroundColor: "#fef2f2" }}>{change.before || "Empty"}</td>
                                <td style={{ border: "1px solid #e2e8f0", padding: "6px 8px", color: "#15803d", backgroundColor: "#f0fdf4" }}>{change.after || "Empty"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ fontSize: "12px", color: "#64748b" }}>No specific field modifications tracked.</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontStyle: "italic" }}>
                    No edit history available for this record.
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </Container>
    </ReportContainer>
  )
}

export default InsuranceReport