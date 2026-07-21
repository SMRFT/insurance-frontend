import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import {
  ReportContainer,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FilterContainer,
  FilterWrapper,
  Label,
  FormControl,
  Button,
  Container,
  SearchInput,
  SearchWrapper,
  ScrollableTableContainer,
  ResponsiveTableWrapper,
  StyledDatePicker,
  PageScrollArea,           // ← NEW
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#6F8B83"
const accentColor  = "#9aaea9"

function EnquiryDetailPage() {
  const [records,           setRecords]           = useState([])
  const [filteredRecords,   setFilteredRecords]   = useState([])
  const [expandedRows,      setExpandedRows]      = useState(new Set())
  const [loading,           setLoading]           = useState(false)
  const [searchTerm,        setSearchTerm]        = useState("")
  const [selectedInsurance, setSelectedInsurance] = useState("")
  const [selectedTreatment, setSelectedTreatment] = useState("")
  const [treatments,        setTreatments]        = useState([])
  const [fromDate,          setFromDate]          = useState(new Date())
  const [toDate,            setToDate]            = useState(new Date())

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => { fetchRecords() }, [fromDate, toDate])
  useEffect(() => { filterRecords() }, [records, searchTerm, selectedInsurance, selectedTreatment])

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_treatment_list/`)
        if (result.success) setTreatments(result.data)
      } catch (error) {
        console.error("Failed to load treatments:", error)
      }
    }
    fetchTreatments()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const response = await apiRequest(`${Insurancebaseurl}enquiry/`, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date:   toDate.toLocaleDateString("en-CA"),
        },
      })
      const raw = Array.isArray(response)
        ? response
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : null

      if (raw !== null) {
        setRecords(raw.map((e) => ({
          ...e,
          follow_ups: Array.isArray(e.follow_ups) ? e.follow_ups : [],
        })))
      } else {
        setRecords([])
        toast.error("Failed to load records")
      }
    } catch {
      setRecords([])
      toast.error("Network error while loading records")
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = Array.isArray(records) ? [...records] : []
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.patientName?.toLowerCase().includes(term) ||
          e.opNumber?.toLowerCase().includes(term)    ||
          e.ipNumber?.toLowerCase().includes(term)    ||
          e.phoneNumber?.includes(term)
      )
    }
    if (selectedInsurance) {
      filtered = filtered.filter(
        (e) => e.insuranceName === selectedInsurance || e.specificInsuranceCompany === selectedInsurance
      )
    }
    if (selectedTreatment) {
      filtered = filtered.filter((e) => e.treatment === selectedTreatment)
    }
    setFilteredRecords(filtered)
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const expandAll   = () => setExpandedRows(new Set(filteredRecords.map((e) => e.enquiry_id)))
  const collapseAll = () => setExpandedRows(new Set())

  const totalFollowUps = filteredRecords.reduce(
    (sum, e) => sum + (e.follow_ups?.length || 0), 0
  )

  const exportToCSV = () => {
    const rows = []
    rows.push([
      "S.No", "Date", "Patient Name", "Phone", "OP Number", "IP Number",
      "Insurance", "Insurance Provider", "Treatment", "Reason For Approach",
      "Enquiry Raised By",
      "Follow Up #", "Follow Up Date", "Follow Up Notes", "Follow Up Added By",
    ].join(","))

    filteredRecords.forEach((e, i) => {
      const base = [
        i + 1, e.date || "", e.patientName || "", e.phoneNumber || "",
        e.opNumber || "", e.ipNumber || "", e.insuranceName || "",
        e.specificInsuranceCompany || "", e.treatment || "", e.reasonForApproach || "",
        e.created_by_name || "",
      ].map((f) => `"${f}"`)

      if (!e.follow_ups?.length) {
        rows.push([...base, '""', '""', '""', '""'].join(","))
      } else {
        e.follow_ups.forEach((fu, fi) => {
          rows.push([
            ...base,
            `"${fi + 1}"`,
            `"${fu.followup_date || ""}"`,
            `"${fu.followup_Remarks || ""}"`,
            `"${fu.created_by_name || ""}"`,
          ].join(","))
        })
      }
    })

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(blob)
    a.download = `enquiry_details_${fromDate.toLocaleDateString("en-CA")}_to_${toDate.toLocaleDateString("en-CA")}.csv`
    a.click()
  }

  return (
    <ReportContainer>
      
      <Container>
        <Title>Enquiry Detail — Follow Up History</Title>

        {/* ── Filters (flex-shrink:0 in SharedStyledComponents) ── */}
        <FilterContainer>
          <SearchWrapper>
            <Label>Search</Label>
            <SearchInput
              type="text"
              placeholder="Search by name, OP/IP number, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>

          <FilterWrapper>
            <Label htmlFor="insFilter">Filter by Insurance:</Label>
            <FormControl id="insFilter" value={selectedInsurance} onChange={(e) => setSelectedInsurance(e.target.value)}>
              <option value="">All Insurance</option>
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
            <Label htmlFor="treatmentFilter">Filter by Treatment:</Label>
            <FormControl id="treatmentFilter" value={selectedTreatment} onChange={(e) => setSelectedTreatment(e.target.value)}>
              <option value="">All Treatments</option>
              {treatments.map((t, i) => (
                <option key={i} value={t.name}>{t.name}</option>
              ))}
            </FormControl>
          </FilterWrapper>

          <FilterWrapper>
            <Label>From Date:</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={(d) => setFromDate(d)}
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
              onChange={(d) => setToDate(d)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              minDate={fromDate}
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>

          <FilterWrapper>
            <Button onClick={exportToCSV} disabled={filteredRecords.length === 0}>Export CSV</Button>
          </FilterWrapper>
        </FilterContainer>

        {/* ── Summary bar (flex-shrink:0) ── */}
        <div style={summaryBar}>
          <span>Showing <strong>{filteredRecords.length}</strong> enquiry(s)</span>
          <span style={{ margin: "0 12px", color: "#d1d5db" }}>|</span>
          <span><strong>{totalFollowUps}</strong> total follow up(s)</span>
        </div>

        {/* ── PAGE SCROLL AREA: takes all remaining height, scrolls internally ── */}
        <PageScrollArea>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              Loading records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              No records found
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredRecords.map((enquiry, index) => {
                const isExpanded    = expandedRows.has(enquiry.enquiry_id)
                const followUpCount = enquiry.follow_ups?.length || 0

                return (
                  <div key={enquiry.enquiry_id || index} style={cardStyles.card}>

                    {/* Enquiry header row — click to toggle */}
                    <div style={cardStyles.header} onClick={() => toggleRow(enquiry.enquiry_id)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                        <span style={cardStyles.index}>{index + 1}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={cardStyles.name}>{enquiry.patientName || "—"}</div>
                          <div style={cardStyles.meta}>
                            {enquiry.date || "—"}
                            {enquiry.opNumber && <span style={cardStyles.badge("#eff6ff","#2563eb")}>{enquiry.opNumber}</span>}
                            {enquiry.ipNumber && <span style={cardStyles.badge("#f0fdf4","#16a34a")}>{enquiry.ipNumber}</span>}
                            {enquiry.phoneNumber && <span>📞 {enquiry.phoneNumber}</span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                        {enquiry.insuranceName && (
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>{enquiry.insuranceName}</div>
                            {enquiry.specificInsuranceCompany && (
                              <div style={{ fontSize: "12px", color: "#6b7280" }}>{enquiry.specificInsuranceCompany}</div>
                            )}
                            {enquiry.treatment && (
                              <div style={{ fontSize: "12px", color: "#6b7280" }}>🩺 {enquiry.treatment}</div>
                            )}
                          </div>
                        )}
                        {!enquiry.insuranceName && enquiry.treatment && (
                          <div style={{ textAlign: "right", fontSize: "12px", color: "#6b7280" }}>
                            🩺 {enquiry.treatment}
                          </div>
                        )}
                        <span style={{
                          ...cardStyles.badge(
                            followUpCount > 0 ? "#f0fdf4" : "#f9fafb",
                            followUpCount > 0 ? "#16a34a" : "#9ca3af"
                          ),
                          minWidth: "80px", textAlign: "center",
                        }}>
                          {followUpCount} follow up{followUpCount !== 1 ? "s" : ""}
                        </span>
                        <span style={{
                          fontSize: "18px", color: primaryColor,
                          transition: "transform 0.2s",
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          display: "inline-block",
                        }}>
                          ›
                        </span>
                      </div>
                    </div>

                    {/* Reason + Raised By (always visible) */}
                    <div style={cardStyles.reason}>
                      {enquiry.reasonForApproach && (
                        <span>
                          <span style={{ color: "#9ca3af", fontSize: "12px", marginRight: "6px" }}>Reason:</span>
                          {enquiry.reasonForApproach}
                        </span>
                      )}
                      {enquiry.created_by_name && (
                        <span style={{ marginLeft: enquiry.reasonForApproach ? "16px" : 0 }}>
                          <span style={{ color: "#9ca3af", fontSize: "12px", marginRight: "4px" }}>Raised by:</span>
                          <span style={cardStyles.badge("#f0f7f5", primaryColor)}>
                            👤 {enquiry.created_by_name}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Follow Up History (expanded) */}
                    {isExpanded && (
                      <div style={cardStyles.followUpsSection}>
                        <div style={cardStyles.followUpsHeader}>Follow Up History</div>
                        {followUpCount === 0 ? (
                          <div style={cardStyles.noFollowUps}>No follow ups recorded yet.</div>
                        ) : (
                          <ScrollableTableContainer>
                            <Table className="frozen-columns-table">
                              <thead>
                                <tr>
                                  <TableHeader style={{ width: "50px" }}>#</TableHeader>
                                  <TableHeader style={{ width: "150px" }}>Follow Up Date</TableHeader>
                                  <TableHeader>Notes / Remarks</TableHeader>
                                  <TableHeader style={{ width: "160px" }}>Added By</TableHeader>
                                </tr>
                              </thead>
                              <tbody>
                                {enquiry.follow_ups.map((fu, fi) => (
                                  <TableRow key={fu.followup_id ?? fi}>
                                    <TableCell style={{ textAlign: "center" }}>{fi + 1}</TableCell>
                                    <TableCell style={{ whiteSpace: "nowrap" }}>{fu.followup_date || "—"}</TableCell>
                                    <TableCell>{fu.followup_Remarks || "—"}</TableCell>
                                    <TableCell>
                                      {fu.created_by_name
                                        ? <span style={cardStyles.badge("#f0f7f5", "#6F8B83")}>👤 {fu.created_by_name}</span>
                                        : "—"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </tbody>
                            </Table>
                          </ScrollableTableContainer>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </PageScrollArea>

        <style>{`
          .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }
          thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: #6F8B83; color: white; }
          .date-picker-popper, .react-datepicker-popper, .react-datepicker { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

const summaryBar = {
  display: "flex", alignItems: "center",
  padding: "10px 16px", background: "#f0f7f5",
  borderRadius: "8px", border: `1px solid #d1e8e4`,
  marginBottom: "16px", fontSize: "14px", color: "#374151",
  flexShrink: 0,
}

const cardStyles = {
  card: {
    border: "1px solid #e5e7eb", borderRadius: "10px",
    overflow: "hidden", background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 18px", cursor: "pointer", background: "#fff",
    gap: "12px", userSelect: "none",
  },
  index: {
    width: "28px", height: "28px", background: "#6F8B83", color: "#fff",
    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", flexShrink: 0,
  },
  name: {
    fontSize: "15px", fontWeight: "700", color: "#111827",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  meta: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "12px", color: "#6b7280", marginTop: "3px", flexWrap: "wrap",
  },
  badge: (bg, color) => ({
    padding: "2px 8px", borderRadius: "12px",
    fontSize: "12px", fontWeight: "600",
    background: bg, color: color,
  }),
  reason: {
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px",
    padding: "6px 18px 10px 60px", fontSize: "13px", color: "#4b5563",
    borderTop: "1px solid #f3f4f6", background: "#fafafa",
  },
  followUpsSection: { borderTop: `2px solid #6F8B83` },
  followUpsHeader: {
    padding: "8px 18px", fontSize: "12px", fontWeight: "700",
    color: "#6F8B83", background: "#f0f7f5",
    letterSpacing: "0.5px", textTransform: "uppercase",
  },
  noFollowUps: {
    padding: "18px", textAlign: "center",
    color: "#9ca3af", fontSize: "13px", fontStyle: "italic",
  },
}

export default EnquiryDetailPage