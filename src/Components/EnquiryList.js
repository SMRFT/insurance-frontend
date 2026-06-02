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
  ResultsInfo,
  ScrollableTableContainer,
  ResponsiveTableWrapper,
  StyledDatePicker,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#6F8B83"
const accentColor  = "#9aaea9"

// ─── FollowUpModal ────────────────────────────────────────────────────────────
// Shows ALL follow-ups for one enquiry.
// User can add a new one or click "Edit" on any existing one.
// ─────────────────────────────────────────────────────────────────────────────
function FollowUpModal({ enquiry, onClose, onSaved }) {
  const [followUps,   setFollowUps]   = useState([])
  const [loading,     setLoading]     = useState(true)

  // editingId: null → no row being edited; number → that followup_id is open for edit
  // editingId: "new" → the Add-new form is open
  const [editingId,   setEditingId]   = useState(null)
  const [formDate,    setFormDate]    = useState("")
  const [formNotes,   setFormNotes]   = useState("")
  const [saving,      setSaving]      = useState(false)

  const base = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // ── Load follow-ups ──────────────────────────────────────────────────────
const fetchFollowUps = async () => {
  setLoading(true)

  try {
    const response = await apiRequest(
      `${base}enquiry/${enquiry.enquiry_id}/follow_ups/`,
      "GET",
      null,
      true
    )

    console.log("FOLLOWUP RESPONSE", response)

    let followupData = []

    if (Array.isArray(response)) {
      followupData = response
    }
    else if (Array.isArray(response?.data)) {
      followupData = response.data
    }
    else if (Array.isArray(response?.data?.data)) {
      followupData = response.data.data
    }
    else if (Array.isArray(response?.data?.follow_ups)) {
      followupData = response.data.follow_ups
    }

    setFollowUps(followupData)
  } catch (error) {
    console.error(error)
    toast.error("Failed to load follow-ups")
    setFollowUps([])
  } finally {
    setLoading(false)
  }
}

  useEffect(() => { fetchFollowUps() }, [enquiry.enquiry_id])

  // ── Open edit form for an existing follow-up ─────────────────────────────
  const startEdit = (fu) => {
    setEditingId(fu.followup_id)
    setFormDate(fu.followup_date  || "")
    setFormNotes(fu.followup_Remarks || "")
  }

  // ── Open add-new form ────────────────────────────────────────────────────
  const startAdd = () => {
    setEditingId("new")
    setFormDate("")
    setFormNotes("")
  }

  // ── Cancel editing ───────────────────────────────────────────────────────
  const cancelEdit = () => {
    setEditingId(null)
    setFormDate("")
    setFormNotes("")
  }

  // ── Save (add or update) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formDate || !formNotes.trim()) {
      toast.error("Please fill in both Follow Up Date and Notes")
      return
    }
    setSaving(true)
    try {
      const isNew   = editingId === "new"
      const url     = isNew
        ? `${base}enquiry/${enquiry.enquiry_id}/follow_ups/`
        : `${base}enquiry/${enquiry.enquiry_id}/follow_ups/${editingId}/`
      const method  = isNew ? "POST" : "PUT"
      const payload = JSON.stringify({ followup_date: formDate, followup_Remarks: formNotes.trim() })

      const res = await apiRequest(url, method, payload, true, { "Content-Type": "application/json" })
      if (res.success) {
        toast.success(isNew ? "✅ Follow up added!" : "✅ Follow up updated!")
        cancelEdit()
        await fetchFollowUps()
        onSaved()
      } else {
        toast.error(`❌ Failed: ${res.error || JSON.stringify(res.errors)}`)
      }
    } catch (err) {
      toast.error(`💥 Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (followup_id) => {
    if (!window.confirm("Delete this follow-up?")) return
    try {
      const res = await apiRequest(
        `${base}enquiry/${enquiry.enquiry_id}/follow_ups/${followup_id}/`,
        "DELETE", null, true
      )
      if (res.success) {
        toast.success("Follow up deleted")
        await fetchFollowUps()
        onSaved()
      } else {
        toast.error("Delete failed")
      }
    } catch (err) {
      toast.error(`💥 Error: ${err.message}`)
    }
  }

  // ─── Inline edit/add form ─────────────────────────────────────────────────
  const renderForm = (label) => (
    <div style={ms.formBox}>
      <div style={{ fontWeight: "600", fontSize: "13px", color: primaryColor, marginBottom: "10px" }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={ms.field}>
          <label style={ms.label}>Date <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            style={ms.input}
          />
        </div>
        <div style={ms.field}>
          <label style={ms.label}>Notes / Remarks <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            placeholder="Enter follow up notes..."
            rows={3}
            style={ms.textarea}
          />
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button style={ms.cancelBtn} onClick={cancelEdit}>Cancel</button>
          <button
            style={{ ...ms.saveBtn, opacity: saving ? 0.7 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : (editingId === "new" ? "Add Follow Up" : "Update")}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={ms.header}>
          <div>
            <h2 style={ms.title}>Follow Ups</h2>
            <p style={ms.subtitle}>
              {enquiry.patientName} — {enquiry.opNumber || enquiry.ipNumber || "—"}
            </p>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={ms.body}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "20px 0" }}>
              Loading follow-ups...
            </p>
          ) : (
            <>
              {/* Existing follow-ups list */}
              {followUps.length === 0 && editingId !== "new" && (
                <p style={{ textAlign: "center", color: "#9ca3af", fontStyle: "italic", marginBottom: "16px" }}>
                  No follow-ups yet.
                </p>
              )}

              {followUps.length > 0 ? (
                followUps.map((fu, index) => (
                  <div
                    key={fu.followup_id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "10px",
                      background: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>Follow Up #{index + 1}</strong>

                      <span
                        style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {fu.followup_date || "-"}
                      </span>
                    </div>

                    <div style={{ color: "#374151" }}>
                      {fu.followup_Remarks || "-"}
                    </div>

                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >

                      <button
                        style={ms.deleteBtn}
                        onClick={() => handleDelete(fu.followup_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : null  
              }

              {/* Add-new form (shown at bottom when "new") */}
              {editingId === "new" && renderForm("New Follow Up")}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={ms.footer}>
          <button style={ms.cancelBtn} onClick={onClose}>Close</button>
          {editingId === null && !loading && (
            <button style={ms.saveBtn} onClick={startAdd}>
              + Add Follow Up
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Modal styles ─────────────────────────────────────────────────────────────
const ms = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "540px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
    display: "flex", flexDirection: "column", maxHeight: "85vh",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "20px 24px 16px", borderBottom: `3px solid ${primaryColor}`,
    background: "#f8faf9", flexShrink: 0,
  },
  title:    { margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#6b7280" },
  closeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280", padding: "0 4px" },
  body:     { padding: "16px 24px", overflowY: "auto", flex: 1 },
  footer:   { display: "flex", justifyContent: "flex-end", gap: "10px", padding: "14px 24px", borderTop: "1px solid #e5e7eb", background: "#f8faf9", flexShrink: 0 },

  fuRowHeader: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "8px 0", borderBottom: "1px solid #f3f4f6",
  },
  fuIndex: {
    width: "22px", height: "22px", borderRadius: "50%",
    background: primaryColor, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: "700", flexShrink: 0,
  },
  fuDate: {
    padding: "2px 8px", borderRadius: "12px",
    background: "#f0fdf4", color: "#16a34a",
    fontSize: "12px", fontWeight: "600",
  },
  fuNotes: {
    padding: "8px 0 14px 32px",
    fontSize: "13px", color: "#4b5563", whiteSpace: "pre-wrap",
    borderBottom: "1px solid #f3f4f6", marginBottom: "4px",
  },
  formBox: {
    background: "#f0f7f5", border: `1px solid #d1e8e4`,
    borderRadius: "8px", padding: "14px", marginBottom: "12px",
  },
  field:    { display: "flex", flexDirection: "column", gap: "4px" },
  label:    { fontSize: "12px", fontWeight: "600", color: "#374151" },
  input:    { padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none", fontFamily: "inherit" },
  textarea: { padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none", fontFamily: "inherit", resize: "vertical" },
  cancelBtn: { padding: "8px 18px", background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "500" },
  saveBtn:   { padding: "8px 18px", background: primaryColor, color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontWeight: "600" },
  editBtn:   { padding: "4px 10px", background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "500" },
  deleteBtn: { padding: "4px 8px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "6px", fontSize: "12px", cursor: "pointer" },
}

// ─── EnquiryList ──────────────────────────────────────────────────────────────
function EnquiryList() {
  const [enquiries,         setEnquiries]         = useState([])
  const [filteredEnquiries, setFilteredEnquiries] = useState([])
  const [loading,           setLoading]           = useState(false)
  const [searchTerm,        setSearchTerm]        = useState("")
  const [selectedInsurance, setSelectedInsurance] = useState("")
  const [fromDate,          setFromDate]          = useState(new Date())
  const [toDate,            setToDate]            = useState(new Date())
  const [followUpTarget,    setFollowUpTarget]    = useState(null)

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => { fetchEnquiries() }, [fromDate, toDate])
  useEffect(() => { filterEnquiries() }, [enquiries, searchTerm, selectedInsurance])

  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const response = await apiRequest(`${Insurancebaseurl}enquiry_list/`, "GET", null, {}, {
        params: {
          from_date: fromDate.toLocaleDateString("en-CA"),
          to_date:   toDate.toLocaleDateString("en-CA"),
        },
      })
    // Handle both shapes: plain array  OR  { success, data: [...] }
    const raw = Array.isArray(response)
        ? response
        : Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response?.data)
            ? response.data
            : null;

      if (raw !== null) {
        // Normalise: ensure follow_ups is always an array on every record
        setEnquiries(raw.map((e) => ({ ...e, follow_ups: Array.isArray(e.follow_ups) ? e.follow_ups : [] })))
      } else {
        setEnquiries([])
        toast.error("Failed to load enquiries")
      }
    } catch {
      setEnquiries([])
      toast.error("Network error while loading enquiries")
    } finally {
      setLoading(false)
    }
  }

  const filterEnquiries = () => {
    let filtered = Array.isArray(enquiries) ? [...enquiries] : []
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
    setFilteredEnquiries(filtered)
  }

  const exportToCSV = () => {
    const headers = ["S.No","Date","OP Number","IP Number","Patient Name","Phone Number",
                     "Insurance Name","Insurance Provider","Reason For Approach","Follow Ups Count"]
    const dataRows = filteredEnquiries.map((e, i) =>
      [
        i + 1, e.date || "", e.opNumber || "", e.ipNumber || "",
        e.patientName || "", e.phoneNumber || "",
        e.insuranceName || "", e.specificInsuranceCompany || "",
        e.reasonForApproach || "",
        e.follow_ups?.length || 0,
      ].map((f) => `"${f}"`).join(",")
    )
    const blob = new Blob([[headers.join(","), ...dataRows].join("\n")], { type: "text/csv;charset=utf-8;" })
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(blob)
    a.download = `enquiry_list_${fromDate.toLocaleDateString("en-CA")}_to_${toDate.toLocaleDateString("en-CA")}.csv`
    a.click()
  }

  return (
    <ReportContainer>
      <Toaster position="top-right" />

      {followUpTarget && (
        <FollowUpModal
          enquiry={followUpTarget}
          onClose={() => setFollowUpTarget(null)}
          onSaved={fetchEnquiries}
        />
      )}

      <Container>
        <Title>Enquiry List</Title>

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
            <Label htmlFor="insuranceFilter">Filter by Insurance:</Label>
            <FormControl id="insuranceFilter" value={selectedInsurance} onChange={(e) => setSelectedInsurance(e.target.value)}>
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
            <Label>From Date:</Label>
            <StyledDatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
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
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select to date"
              minDate={fromDate}
              popperProps={{ strategy: "fixed", modifiers: [{ name: "offset", options: { offset: [0, 10] } }] }}
              popperClassName="date-picker-popper"
            />
          </FilterWrapper>

          <FilterWrapper>
            <Button onClick={exportToCSV} disabled={filteredEnquiries.length === 0}>Export CSV</Button>
          </FilterWrapper>
        </FilterContainer>

        <ResultsInfo>Showing {filteredEnquiries.length} result(s)</ResultsInfo>

        <ResponsiveTableWrapper>
          <ScrollableTableContainer>
            <Table className="frozen-columns-table">
              <thead>
                <tr>
                  <TableHeader className="frozen-col frozen-col-0">S.No</TableHeader>
                  <TableHeader className="frozen-col frozen-col-1">Date</TableHeader>
                  <TableHeader className="frozen-col frozen-col-2">Patient Name</TableHeader>
                  <TableHeader>Phone Number</TableHeader>
                  <TableHeader>OP Number</TableHeader>
                  <TableHeader>IP Number</TableHeader>
                  <TableHeader>Insurance Name</TableHeader>
                  <TableHeader>Insurance Provider</TableHeader>
                  <TableHeader>Reason For Approach</TableHeader>
                  <TableHeader>Follow Ups</TableHeader>
                  <TableHeader style={{ textAlign: "center" }}>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="11" style={{ textAlign: "center", padding: "40px" }}>
                      Loading enquiries...
                    </TableCell>
                  </TableRow>
                ) : filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enquiry, index) => {
                    const followUpCount = enquiry.follow_ups?.length || 0
                    const lastFollowUp  = followUpCount > 0
                      ? enquiry.follow_ups[enquiry.follow_ups.length - 1]
                      : null

                    return (
                      <TableRow key={enquiry.enquiry_id || index}>
                        <TableCell className="frozen-col frozen-col-0" style={{ textAlign: "center" }}>{index + 1}</TableCell>
                        <TableCell className="frozen-col frozen-col-1" style={{ whiteSpace: "nowrap" }}>{enquiry.date || "—"}</TableCell>
                        <TableCell className="frozen-col frozen-col-2" style={{ fontWeight: "600" }}>{enquiry.patientName || "—"}</TableCell>
                        <TableCell>{enquiry.phoneNumber || "—"}</TableCell>
                        <TableCell>{enquiry.opNumber || "—"}</TableCell>
                        <TableCell>{enquiry.ipNumber || "—"}</TableCell>
                        <TableCell>{enquiry.insuranceName || "—"}</TableCell>
                        <TableCell>{enquiry.specificInsuranceCompany || "—"}</TableCell>
                        <TableCell
                          style={{ maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                          title={enquiry.reasonForApproach}
                        >
                          {enquiry.reasonForApproach || "—"}
                        </TableCell>

                        {/* Follow Up count + latest date */}
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          {followUpCount > 0 ? (
                            <span style={{
                              padding: "2px 8px", borderRadius: "12px",
                              background: "#f0fdf4", color: "#16a34a",
                              fontSize: "12px", fontWeight: "600",
                            }}>
                              {followUpCount} {followUpCount === 1 ? "follow up" : "follow ups"}
                            </span>
                          ) : (
                            <span style={{ color: "#d1d5db" }}>—</span>
                          )}
                          {lastFollowUp && (
                            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                              Last: {lastFollowUp.followup_date}
                            </div>
                          )}
                        </TableCell>

                        {/* Action button — always shows the modal */}
                        <TableCell style={{ textAlign: "center" }}>
                          {followUpCount > 0 ? (
                            <button
                              onClick={() => setFollowUpTarget(enquiry)}
                              style={btnStyle.edit}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#d97706"; e.currentTarget.style.color = "#fff" }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = btnStyle.edit.background; e.currentTarget.style.color = btnStyle.edit.color }}
                            >
                              ✏️ Follow Ups ({followUpCount})
                            </button>
                          ) : (
                            <button
                              onClick={() => setFollowUpTarget(enquiry)}
                              style={btnStyle.add}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff" }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = btnStyle.add.background; e.currentTarget.style.color = btnStyle.add.color }}
                            >
                              + Follow Up
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="11" style={{ textAlign: "center", padding: "40px" }}>
                      No enquiries found matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </ScrollableTableContainer>
        </ResponsiveTableWrapper>

        <style jsx global>{`
          .frozen-columns-table { position: relative; }
          .frozen-col { position: sticky !important; background-color: white; z-index: 10; }
          .frozen-col-0 { left: 0px; min-width: 60px; text-align: center; }
          .frozen-col-1 { left: 60px; min-width: 110px; }
          .frozen-col-2 { left: 170px; min-width: 160px; border-right: 2px solid #ddd; }
          .frozen-col-2::after { content: ''; position: absolute; top: 0; right: -10px; bottom: 0; width: 10px; background: linear-gradient(to right, rgba(0,0,0,0.1), transparent); pointer-events: none; }
          thead tr th { position: sticky !important; top: 0; z-index: 11; }
          thead .frozen-col { background-color: ${primaryColor}; position: sticky !important; top: 0; z-index: 20 !important; }
          tbody tr:hover .frozen-col { background-color: #f5f5f5; }
          .date-picker-popper, .react-datepicker-popper, .react-datepicker { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

const btnStyle = {
  edit: {
    padding: "5px 12px", background: "#fef3c7", color: "#d97706",
    border: "1px solid #fde68a", borderRadius: "6px",
    fontSize: "12px", cursor: "pointer", fontWeight: "500", whiteSpace: "nowrap",
  },
  add: {
    padding: "5px 12px", background: "#f0fdf4", color: "#16a34a",
    border: "1px solid #bbf7d0", borderRadius: "6px",
    fontSize: "12px", cursor: "pointer", fontWeight: "500", whiteSpace: "nowrap",
  },
}

export default EnquiryList