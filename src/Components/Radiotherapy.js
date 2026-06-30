import { useEffect, useState } from "react"
import styled from "styled-components"
import { format } from "date-fns"
import {
  Container,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Select,
  Label,
  Input,
  Button,
  FormControl,
  FilterContainer,
  FilterWrapper,
  ScrollableTableContainer,
  ReportContainer,
  StyledDatePicker,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"
const warningColor = "#f59e0b"

const SaveButton = styled(Button)`
  background-color: #10b981;
  margin-left: 8px;
  &:hover { background-color: #059669; }
`

const CancelButton = styled(Button)`
  background-color: #ef4444;
  margin-left: 8px;
  &:hover { background-color: #dc2626; }
`

const PendingAmount = styled.div`
  font-weight: bold;
  color: ${(props) => (props.value < 0 ? "#ef4444" : props.value > 0 ? "#10b981" : textColor)};
`

const EditHistoryContainer = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  z-index: 1000;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`

const EditHistoryTitle = styled.h3`
  color: ${primaryColor};
  margin-bottom: 15px;
  border-bottom: 1px solid ${accentColor};
  padding-bottom: 10px;
`

const EditHistoryItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${backgroundColor};
  border-left: 4px solid ${primaryColor};
`

const EditHistoryDate = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`

const EditHistoryDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 999;
`

const Badge = styled.span`
  background-color: ${warningColor};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
`

const EditModal = styled.div`
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  z-index: 1000;
  max-width: 500px;
  width: 90%;
`

const ModalTitle = styled.h3`
  color: ${primaryColor};
  margin-bottom: 20px;
  border-bottom: 1px solid ${accentColor};
  padding-bottom: 10px;
  text-align: center;
`

const ModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background-color: ${backgroundColor};
  border-radius: 5px;
`

const ModalLabel = styled.div`
  font-weight: 500;
  color: ${textColor};
`

const ModalValue = styled.div`
  font-weight: bold;
  color: ${(props) => (props.negative ? "#ef4444" : props.positive ? "#10b981" : textColor)};
`

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`

const DateDisplay = styled.div`
  font-size: 14px;
  color: ${textColor};
  margin-bottom: 15px;
  text-align: center;
  background-color: ${backgroundColor};
  padding: 8px;
  border-radius: 5px;
  font-weight: 500;
`

const RadiotherapyReport = () => {
  const [insuranceData, setInsuranceData]     = useState([])
  const [filteredData, setFilteredData]       = useState([])
  const [selectedCompany, setSelectedCompany] = useState("")
  const [fromDate, setFromDate]               = useState(new Date())
  const [toDate, setToDate]                   = useState(new Date())
  const [editingRow, setEditingRow]           = useState(null)
  const [editValues, setEditValues]           = useState({
    billAmount: "", claimedAmount: "", pendingAmount: "",
    paymentAmount: "", paymentType: "Partial Payment",
  })
  const [showEditHistory, setShowEditHistory]     = useState(false)
  const [currentEditHistory, setCurrentEditHistory] = useState([])
  const [showEditModal, setShowEditModal]         = useState(false)
  const [currentItem, setCurrentItem]             = useState(null)
  const [paymentDate, setPaymentDate]             = useState(new Date().toISOString().split("T")[0])
  const [newPendingAmount, setNewPendingAmount]   = useState(0)

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  // Refetch whenever date range changes
  useEffect(() => { fetchData() }, [fromDate, toDate])

  useEffect(() => {
    if (currentItem && editValues.paymentAmount) {
      const currentPending = Number.parseFloat(editValues.pendingAmount) || 0
      const payment        = Number.parseFloat(editValues.paymentAmount) || 0
      setNewPendingAmount(currentPending - payment)
    }
  }, [editValues.paymentAmount, editValues.pendingAmount, currentItem])

  const fetchData = async () => {
    const params = new URLSearchParams()
    params.append("from_date", fromDate.toLocaleDateString("en-CA"))
    params.append("to_date",   toDate.toLocaleDateString("en-CA"))
    if (selectedCompany) params.append("companyName", selectedCompany)

    const url      = `${Insurancebaseurl}insurance/?${params.toString()}`
    const response = await apiRequest(url, "GET")

    if (response.success) {
      const radiotherapyData = (response.data || []).filter(
        (item) => item.treatmentType === "Radiotherapy"
      )
      setInsuranceData(radiotherapyData)
      applyCompanyFilter(radiotherapyData, selectedCompany)
    } else {
      setInsuranceData([])
      setFilteredData([])
      console.error("Error fetching data:", response.error || response.data)
    }
  }

  const applyCompanyFilter = (data, company) => {
    setFilteredData(company ? data.filter((item) => item.companyName === company) : data)
  }

  const handleCompanyFilterChange = (e) => {
    const val = e.target.value
    setSelectedCompany(val)
    applyCompanyFilter(insuranceData, val)
  }

  const handleFromDateChange = (date) => setFromDate(date)
  const handleToDateChange   = (date) => setToDate(date)

  const handleViewFile = (fileId) => {
    if (!fileId) return
    window.open(`${Insurancebaseurl}insurance/serve_file/${fileId}`, "_blank")
  }

  const handleEdit = (item) => {
    setCurrentItem(item)
    const calculatedPending = calculatePendingAmount(
      Number.parseFloat(item.billAmount) || 0,
      Number.parseFloat(item.claimedAmount) || 0,
    )
    setEditValues({
      billAmount:    item.billAmount || "",
      claimedAmount: item.claimedAmount || "",
      pendingAmount: item.pendingAmount || calculatedPending.toString(),
      paymentAmount: "",
      paymentType:   "Partial Payment",
    })
    setShowEditModal(true)
    setPaymentDate(new Date().toISOString().split("T")[0])
    setNewPendingAmount(Number.parseFloat(item.pendingAmount) || calculatedPending)
  }

  const getUpdateIdentifier = (item) => {
    if (item.opNumber)   return { identifier: item.opNumber,   type: "opNumber" }
    if (item.ipNumber)   return { identifier: item.ipNumber,   type: "ipNumber" }
    if (item.billNumber) return { identifier: item.billNumber, type: "billNumber" }
    return { identifier: null, type: null }
  }

  const handleSaveModal = async () => {
    if (!currentItem) return
    const pendingAmount      = Number.parseFloat(editValues.pendingAmount) || 0
    const paymentAmount      = Number.parseFloat(editValues.paymentAmount) || 0
    const newPendingAmountValue = pendingAmount - paymentAmount

    const editHistoryEntry = {
      date: new Date().toISOString(), paymentDate,
      previousBillAmount:    currentItem.billAmount,
      newBillAmount:         editValues.billAmount,
      previousClaimedAmount: currentItem.claimedAmount,
      newClaimedAmount:      editValues.claimedAmount,
      previousPendingAmount: currentItem.pendingAmount || calculatePendingAmount(
        Number.parseFloat(currentItem.billAmount) || 0,
        Number.parseFloat(currentItem.claimedAmount) || 0,
      ).toString(),
      newPendingAmount: newPendingAmountValue.toString(),
      paymentAmount:    paymentAmount.toString(),
      paymentType:      editValues.paymentType,
    }

    const updatedItem = {
      ...currentItem,
      billAmount:    editValues.billAmount,
      claimedAmount: editValues.claimedAmount,
      pendingAmount: newPendingAmountValue.toString(),
      editHistory:   [...(currentItem.editHistory || []), editHistoryEntry],
    }

    try {
      const { identifier, type } = getUpdateIdentifier(currentItem)
      if (!identifier) { alert("Error: No valid identifier found for update"); return }

      const formData = new FormData()
      Object.keys(updatedItem).forEach((key) => {
        if (key !== "editHistory") formData.append(key, updatedItem[key])
      })
      formData.append("editHistory", JSON.stringify(updatedItem.editHistory))

      const response = await apiRequest(
        `${Insurancebaseurl}insurance/update/${encodeURIComponent(identifier)}/`,
        "PUT", formData, { "Content-Type": undefined }
      )

      if (response.status === 200) {
        const updatedData = insuranceData.map((r) =>
          r.billNumber === currentItem.billNumber ? updatedItem : r
        )
        setInsuranceData(updatedData)
        applyCompanyFilter(updatedData, selectedCompany)
        setShowEditModal(false)
        setCurrentItem(null)
      } else {
        const errorData = await response.json()
        alert(`Failed to update record: ${errorData.error || errorData.details || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating record:", error)
      alert(`Error updating record: ${error.message}`)
    }
  }

  const handleSave = async (item) => {
    const pendingAmount = Number.parseFloat(editValues.pendingAmount) || 0
    const paymentAmount = Number.parseFloat(editValues.paymentAmount) || 0

    const editHistoryEntry = {
      date: new Date().toISOString(),
      previousBillAmount:    item.billAmount,
      newBillAmount:         editValues.billAmount,
      previousClaimedAmount: item.claimedAmount,
      newClaimedAmount:      editValues.claimedAmount,
      previousPendingAmount: item.pendingAmount || calculatePendingAmount(
        Number.parseFloat(item.billAmount) || 0,
        Number.parseFloat(item.claimedAmount) || 0,
      ).toString(),
      newPendingAmount: pendingAmount.toString(),
      paymentAmount:    paymentAmount.toString(),
      paymentType:      editValues.paymentType,
    }

    const updatedItem = {
      ...item,
      billAmount:    editValues.billAmount,
      claimedAmount: editValues.claimedAmount,
      pendingAmount: pendingAmount.toString(),
      editHistory:   [...(item.editHistory || []), editHistoryEntry],
    }

    try {
      const { identifier, type } = getUpdateIdentifier(item)
      if (!identifier) { alert("Error: No valid identifier found for update"); return }

      const formData = new FormData()
      Object.keys(updatedItem).forEach((key) => {
        if (key !== "editHistory") formData.append(key, updatedItem[key])
      })
      formData.append("editHistory", JSON.stringify(updatedItem.editHistory))

      const response = await apiRequest(
        `${Insurancebaseurl}insurance/update/${encodeURIComponent(identifier)}/`,
        "PUT", formData, { "Content-Type": undefined }
      )

      if (response.status === 200) {
        const updatedData = insuranceData.map((r) =>
          r.billNumber === item.billNumber ? updatedItem : r
        )
        setInsuranceData(updatedData)
        applyCompanyFilter(updatedData, selectedCompany)
        setEditingRow(null)
      } else {
        const errorData = await response.json()
        alert(`Failed to update record: ${errorData.error || errorData.details || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating record:", error)
      alert(`Error updating record: ${error.message}`)
    }
  }

  const handleCancel       = ()      => setEditingRow(null)
  const handleCancelModal  = ()      => { setShowEditModal(false); setCurrentItem(null) }
  const handleInputChange  = (e)     => setEditValues({ ...editValues, [e.target.name]: e.target.value })
  const handleDateChange   = (e)     => setPaymentDate(e.target.value)
  const calculatePendingAmount = (bill, claimed) => bill - claimed
  const viewEditHistory    = (item)  => { setCurrentEditHistory(item.editHistory || []); setShowEditHistory(true) }
  const closeEditHistory   = ()      => setShowEditHistory(false)

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try { return format(new Date(dateString), "dd/MM/yyyy") }
    catch { return dateString }
  }

  return (
    <ReportContainer>
      <Container>
        <Title>Radiotherapy Patients Report</Title>

          {/* Company filter */}
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

          {/* Refresh */}
          <FilterWrapper>
            <Label>&nbsp;</Label>
            <Button onClick={fetchData}>Refresh Data</Button>
          </FilterWrapper>
        </FilterContainer>

        <ScrollableTableContainer style={{ flex: 1, minHeight: 0 }}>
          <Table className="frozen-columns-table">
            <thead>
              <tr>
                <TableHeader className="frozen-col frozen-col-0">Patient UHID</TableHeader>
                <TableHeader className="frozen-col frozen-col-1">Patient Name</TableHeader>
                <TableHeader>Bill Number</TableHeader>
                <TableHeader>Bill Date</TableHeader>
                <TableHeader>Company Name</TableHeader>
                <TableHeader>Radiotherapy Cycles</TableHeader>
                <TableHeader>Bill Amount</TableHeader>
                <TableHeader>Claimed Amount</TableHeader>
                <TableHeader>Pending Amount</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                  <TableRow key={item.billNumber}>
                    <TableCell className="frozen-col frozen-col-0">{item.patient_uhid || "N/A"}</TableCell>
                    <TableCell className="frozen-col frozen-col-1">{item.patient_name || "N/A"}</TableCell>
                    <TableCell>{item.billNumber || "N/A"}</TableCell>
                  <TableCell>{formatDate(item.billDate)}</TableCell>
                  <TableCell>{item.companyName || "N/A"}</TableCell>
                  <TableCell>{item.radiotherapyCycles || "N/A"}</TableCell>

                  {editingRow === item.billNumber ? (
                    <>
                      <TableCell>
                        <Input type="number" name="billAmount" value={editValues.billAmount} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" name="claimedAmount" value={editValues.claimedAmount} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" name="pendingAmount" value={editValues.pendingAmount} onChange={handleInputChange} />
                        <div style={{ marginTop: "10px" }}>
                          <Label>Payment Type:</Label>
                          <Select name="paymentType" value={editValues.paymentType} onChange={handleInputChange} style={{ width: "100%", marginBottom: "10px" }}>
                            <option value="Partial Payment">Partial Payment</option>
                            <option value="Full Payment">Full Payment</option>
                            <option value="Adjustment">Adjustment</option>
                            <option value="Refund">Refund</option>
                          </Select>
                          <Label>Payment Amount:</Label>
                          <Input type="number" name="paymentAmount" value={editValues.paymentAmount} onChange={handleInputChange} placeholder="Enter amount paid" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <SaveButton onClick={() => handleSave(item)}>Save</SaveButton>
                        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.billAmount || "0"}</TableCell>
                      <TableCell>{item.claimedAmount || "0"}</TableCell>
                      <TableCell>
                        <PendingAmount value={Number.parseFloat(item.pendingAmount) || calculatePendingAmount(
                          Number.parseFloat(item.billAmount) || 0,
                          Number.parseFloat(item.claimedAmount) || 0,
                        )}>
                          {(Number.parseFloat(item.pendingAmount)).toFixed(2)}
                        </PendingAmount>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(item)} style={{ marginBottom: "10px" }}>Edit</Button>
                        {item.editHistory && item.editHistory.length > 0 && (
                          <Button onClick={() => viewEditHistory(item)}>
                            History <Badge>{item.editHistory.length}</Badge>
                          </Button>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: "center" }}>
                    No radiotherapy patients found
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </ScrollableTableContainer>

        {/* Edit Modal */}
        {showEditModal && currentItem && (
          <>
            <Overlay onClick={handleCancelModal} />
            <EditModal>
              <ModalTitle>Edit Payment</ModalTitle>
              <DateDisplay>
                Payment Date: <Input type="date" value={paymentDate} onChange={handleDateChange} />
              </DateDisplay>
              <ModalRow>
                <ModalLabel>Patient:</ModalLabel>
                <ModalValue>{currentItem.patient_name || "N/A"}</ModalValue>
              </ModalRow>
              <ModalRow>
                <ModalLabel>Bill Number:</ModalLabel>
                <ModalValue>{currentItem.billNumber || "N/A"}</ModalValue>
              </ModalRow>
              <ModalRow>
                <ModalLabel>Current Pending Amount:</ModalLabel>
                <ModalValue positive={Number(editValues.pendingAmount) > 0} negative={Number(editValues.pendingAmount) < 0}>
                  {Number(editValues.pendingAmount).toFixed(2)}
                </ModalValue>
              </ModalRow>
              <ModalRow>
                <ModalLabel>Payment Type:</ModalLabel>
                <Select name="paymentType" value={editValues.paymentType} onChange={handleInputChange} style={{ width: "60%" }}>
                  <option value="Partial Payment">Partial Payment</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Adjustment">Adjustment</option>
                  <option value="Refund">Refund</option>
                </Select>
              </ModalRow>
              <ModalRow>
                <ModalLabel>Payment Amount:</ModalLabel>
                <Input type="number" name="paymentAmount" value={editValues.paymentAmount} onChange={handleInputChange} placeholder="Enter amount" style={{ width: "60%" }} />
              </ModalRow>
              {editValues.paymentAmount && (
                <ModalRow>
                  <ModalLabel>New Pending Amount:</ModalLabel>
                  <ModalValue positive={newPendingAmount > 0} negative={newPendingAmount < 0}>
                    {newPendingAmount.toFixed(2)}
                  </ModalValue>
                </ModalRow>
              )}
              <ModalButtonContainer>
                <CancelButton onClick={handleCancelModal}>Cancel</CancelButton>
                <SaveButton onClick={handleSaveModal}>Save</SaveButton>
              </ModalButtonContainer>
            </EditModal>
          </>
        )}

        {/* Edit History Modal */}
        {showEditHistory && (
          <>
            <Overlay onClick={closeEditHistory} />
            <EditHistoryContainer>
              <EditHistoryTitle>Edit History</EditHistoryTitle>
              {currentEditHistory.length > 0 ? (
                currentEditHistory.map((edit, index) => (
                  <EditHistoryItem key={index}>
                    <EditHistoryDate>
                      {formatDate(edit.date)} {format(new Date(edit.date), "HH:mm:ss")}
                    </EditHistoryDate>
                    {edit.paymentDate && (
                      <EditHistoryDetails>
                        <span>Payment Date:</span>
                        <span>{formatDate(edit.paymentDate)}</span>
                      </EditHistoryDetails>
                    )}
                    <EditHistoryDetails>
                      <span>Bill Amount:</span>
                      <span>{edit.previousBillAmount || "0"} → {edit.newBillAmount}</span>
                    </EditHistoryDetails>
                    <EditHistoryDetails>
                      <span>Claimed Amount:</span>
                      <span>{edit.previousClaimedAmount || "0"} → {edit.newClaimedAmount}</span>
                    </EditHistoryDetails>
                    <EditHistoryDetails>
                      <span>Pending Amount:</span>
                      <span>{edit.previousPendingAmount || "0"} → {edit.newPendingAmount}</span>
                    </EditHistoryDetails>
                    {edit.paymentType && (
                      <EditHistoryDetails>
                        <span>Payment Type:</span>
                        <span>{edit.paymentType}</span>
                      </EditHistoryDetails>
                    )}
                    {edit.paymentAmount && (
                      <EditHistoryDetails>
                        <span>Payment Amount:</span>
                        <span>{edit.paymentAmount}</span>
                      </EditHistoryDetails>
                    )}
                  </EditHistoryItem>
                ))
              ) : (
                <p>No edit history available</p>
              )}
              <Button onClick={closeEditHistory} style={{ marginTop: "15px" }}>Close</Button>
            </EditHistoryContainer>
          </>
        )}

        <style>{`
          .frozen-columns-table { border-collapse: separate !important; border-spacing: 0 !important; }
          .frozen-col { position: sticky !important; z-index: 10; background-color: #ffffff; outline: 1px solid #b0c4be; }
          .frozen-col-0 { left: 0px; min-width: 100px; text-align: center; }
          .frozen-col-1 { left: 100px; min-width: 150px; box-shadow: 4px 0 6px -2px rgba(0,0,0,0.15); }
          thead tr th { position: sticky !important; top: 0; z-index: 11; background-color: #6F8B83; color: white; }
          thead .frozen-col { background-color: #6F8B83 !important; color: #fff; position: sticky !important; top: 0; z-index: 20 !important; outline: 1px solid #9aaea9; }
          tbody tr:nth-child(even) .frozen-col { background-color: #f9f9f9; }
          tbody tr:nth-child(odd) .frozen-col { background-color: #ffffff; }
          tbody tr:hover .frozen-col { background-color: #e8f0ee !important; }
          .date-picker-popper      { z-index: 9999 !important; }
          .react-datepicker-popper { z-index: 9999 !important; }
          .react-datepicker        { z-index: 9999 !important; }
        `}</style>
      </Container>
    </ReportContainer>
  )
}

export default RadiotherapyReport