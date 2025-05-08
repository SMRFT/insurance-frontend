"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import { format } from "date-fns"

const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"
const warningColor = "#f59e0b"

const Container = styled.div`
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor}40);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1100px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  margin: 0 auto;
`

const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 30px;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
`

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  font-family: 'Roboto', sans-serif;
  display: block;
`

const Select = styled.select`
  padding: 8px 12px;
  margin: 0 10px;
  border-radius: 5px;
  border: 1px solid ${accentColor};
  font-size: 14px;
  background-color: white;
`

const ScrollableTableContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid ${accentColor};
  border-radius: 10px;
  background-color: #fff;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background-color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
`

const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px;
  text-align: center;
  border: 1px solid ${accentColor};
  position: sticky;
  top: 0;
  z-index: 1;
  letter-spacing: 0.5px;
  white-space: nowrap;
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

const TableCell = styled.td`
  padding: 12px;
  color: ${textColor};
  border: 1px solid ${accentColor};
  text-align: center;
  word-break: break-word;
  line-height: 1.6;
`

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  background-color: ${primaryColor};
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${accentColor};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`

const SaveButton = styled(Button)`
  background-color: #10b981;
  margin-left: 8px;
  
  &:hover {
    background-color: #059669;
  }
`

const CancelButton = styled(Button)`
  background-color: #ef4444;
  margin-left: 8px;
  
  &:hover {
    background-color: #dc2626;
  }
`

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${accentColor};
  border-radius: 5px;
  width: 100%;
  font-size: 14px;
`

const PendingAmount = styled.div`
  font-weight: bold;
  color: ${(props) => (props.value < 0 ? "#ef4444" : props.value > 0 ? "#10b981" : textColor)};
`

const EditHistoryContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
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

// New styled components for the edit modal
const EditModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
  const [insuranceData, setInsuranceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedCompany, setSelectedCompany] = useState("")
  const [editingRow, setEditingRow] = useState(null)
  const [editValues, setEditValues] = useState({
    billAmount: "",
    claimedAmount: "",
    pendingAmount: "",
    paymentAmount: "",
    paymentType: "Partial Payment",
  })
  const [showEditHistory, setShowEditHistory] = useState(false)
  const [currentEditHistory, setCurrentEditHistory] = useState([])

  // New state for the edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [newPendingAmount, setNewPendingAmount] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Calculate new pending amount when payment amount changes
    if (currentItem && editValues.paymentAmount) {
      const currentPending = Number.parseFloat(editValues.pendingAmount) || 0
      const payment = Number.parseFloat(editValues.paymentAmount) || 0
      setNewPendingAmount(currentPending - payment)
    }
  }, [editValues.paymentAmount, editValues.pendingAmount, currentItem])

  const fetchData = () => {
    fetch("https://insurance.shinovadatabase.in/insurance/")
      .then((response) => response.json())
      .then((data) => {
        // Filter only radiotherapy patients
        const radiotherapyData = data.filter((item) => item.treatmentType === "Radiotherapy")
        setInsuranceData(radiotherapyData)
        setFilteredData(radiotherapyData)
      })
      .catch((error) => console.error("Error fetching data:", error))
  }

  const filterData = (company) => {
    if (company) {
      const filtered = insuranceData.filter((item) => item.companyName === company)
      setFilteredData(filtered)
    } else {
      setFilteredData(insuranceData)
    }
  }

  const handleCompanyFilterChange = (event) => {
    const selected = event.target.value
    setSelectedCompany(selected)
    filterData(selected)
  }

  const handleViewFile = (fileId) => {
    if (!fileId) return
    const fileUrl = `https://insurance.shinovadatabase.in/insurance/serve_file/${fileId}`
    window.open(fileUrl, "_blank")
  }

  const handleEdit = (item) => {
    setCurrentItem(item)
    const calculatedPending = calculatePendingAmount(
      Number.parseFloat(item.billAmount) || 0,
      Number.parseFloat(item.claimedAmount) || 0,
    )

    setEditValues({
      billAmount: item.billAmount || "",
      claimedAmount: item.claimedAmount || "",
      pendingAmount: item.pendingAmount || calculatedPending.toString(),
      paymentAmount: "",
      paymentType: "Partial Payment",
    })

    // Show the edit modal instead of inline editing
    setShowEditModal(true)
    setPaymentDate(new Date().toISOString().split("T")[0])
    setNewPendingAmount(Number.parseFloat(item.pendingAmount) || calculatedPending)
  }

  const handleSaveModal = async () => {
    if (!currentItem) return

    // Get the current pending amount
    const pendingAmount = Number.parseFloat(editValues.pendingAmount) || 0
    const paymentAmount = Number.parseFloat(editValues.paymentAmount) || 0

    // Calculate new pending amount
    const newPendingAmountValue = pendingAmount - paymentAmount

    // Create edit history entry
    const editHistoryEntry = {
      date: new Date().toISOString(),
      paymentDate: paymentDate,
      previousBillAmount: currentItem.billAmount,
      newBillAmount: editValues.billAmount,
      previousClaimedAmount: currentItem.claimedAmount,
      newClaimedAmount: editValues.claimedAmount,
      previousPendingAmount:
        currentItem.pendingAmount ||
        calculatePendingAmount(
          Number.parseFloat(currentItem.billAmount) || 0,
          Number.parseFloat(currentItem.claimedAmount) || 0,
        ).toString(),
      newPendingAmount: newPendingAmountValue.toString(),
      paymentAmount: paymentAmount.toString(),
      paymentType: editValues.paymentType,
    }

    // Prepare data for update
    const updatedItem = {
      ...currentItem,
      billAmount: editValues.billAmount,
      claimedAmount: editValues.claimedAmount,
      pendingAmount: newPendingAmountValue.toString(),
      editHistory: [...(currentItem.editHistory || []), editHistoryEntry],
    }

    try {
      // Send update to server
      const formData = new FormData()
      Object.keys(updatedItem).forEach((key) => {
        if (key !== "editHistory") {
          formData.append(key, updatedItem[key])
        }
      })

      // Add edit history as JSON string
      formData.append("editHistory", JSON.stringify(updatedItem.editHistory))

      const response = await fetch(`https://insurance.shinovadatabase.in/insurance/update_pendingamount/${currentItem.billNumber}/`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        // Update local state
        const updatedData = insuranceData.map((record) =>
          record.billNumber === currentItem.billNumber ? updatedItem : record,
        )
        setInsuranceData(updatedData)
        filterData(selectedCompany)
        setShowEditModal(false)
        setCurrentItem(null)
      } else {
        alert("Failed to update record")
      }
    } catch (error) {
      console.error("Error updating record:", error)
      alert("Error updating record")
    }
  }

  const handleSave = async (item) => {
    // Use the manually entered pending amount instead of calculating it
    const pendingAmount = Number.parseFloat(editValues.pendingAmount) || 0
    const paymentAmount = Number.parseFloat(editValues.paymentAmount) || 0

    // Create edit history entry
    const editHistoryEntry = {
      date: new Date().toISOString(),
      previousBillAmount: item.billAmount,
      newBillAmount: editValues.billAmount,
      previousClaimedAmount: item.claimedAmount,
      newClaimedAmount: editValues.claimedAmount,
      previousPendingAmount:
        item.pendingAmount ||
        calculatePendingAmount(
          Number.parseFloat(item.billAmount) || 0,
          Number.parseFloat(item.claimedAmount) || 0,
        ).toString(),
      newPendingAmount: pendingAmount.toString(),
      paymentAmount: paymentAmount.toString(),
      paymentType: editValues.paymentType,
    }

    // Prepare data for update
    const updatedItem = {
      ...item,
      billAmount: editValues.billAmount,
      claimedAmount: editValues.claimedAmount,
      pendingAmount: pendingAmount.toString(),
      editHistory: [...(item.editHistory || []), editHistoryEntry],
    }

    try {
      // Send update to server
      const formData = new FormData()
      Object.keys(updatedItem).forEach((key) => {
        if (key !== "editHistory") {
          formData.append(key, updatedItem[key])
        }
      })

      // Add edit history as JSON string
      formData.append("editHistory", JSON.stringify(updatedItem.editHistory))

      const response = await fetch(`https://insurance.shinovadatabase.in/insurance/update_pendingamount/${item.billNumber}/`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        // Update local state
        const updatedData = insuranceData.map((record) =>
          record.billNumber === item.billNumber ? updatedItem : record,
        )
        setInsuranceData(updatedData)
        filterData(selectedCompany)
        setEditingRow(null)
      } else {
        alert("Failed to update record")
      }
    } catch (error) {
      console.error("Error updating record:", error)
      alert("Error updating record")
    }
  }

  const handleCancel = () => {
    setEditingRow(null)
  }

  const handleCancelModal = () => {
    setShowEditModal(false)
    setCurrentItem(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditValues({
      ...editValues,
      [name]: value,
    })
  }

  const handleDateChange = (e) => {
    setPaymentDate(e.target.value)
  }

  const calculatePendingAmount = (billAmount, claimedAmount) => {
    return billAmount - claimedAmount
  }

  const viewEditHistory = (item) => {
    setCurrentEditHistory(item.editHistory || [])
    setShowEditHistory(true)
  }

  const closeEditHistory = () => {
    setShowEditHistory(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <Container>
      <Title>Radiotherapy Patients Report</Title>
      <FilterContainer>
        <div>
          <Label htmlFor="companyName">Filter by Company: </Label>
          <Select id="companyName" value={selectedCompany} onChange={handleCompanyFilterChange}>
            <option value="">All Companies</option>
            <option value="General Insurance">General Insurance</option>
            <option value="ECHS">ECHS</option>
            <option value="ESI">ESI</option>
            <option value="ESIC">ESIC</option>
            <option value="Railway">Railway</option>
            <option value="CTSE">CTSE</option>
            <option value="TNCMCHIS">TNCMCHIS</option>
            <option value="TKT">TKT</option>
            <option value="FCI">FCI</option>
          </Select>
        </div>
        <Button onClick={fetchData}>Refresh Data</Button>
      </FilterContainer>
      <ScrollableTableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Patient UHID</TableHeader>
              <TableHeader>Patient Name</TableHeader>
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
                <TableCell>{item.patient_uhid || "N/A"}</TableCell>
                <TableCell>{item.patient_name || "N/A"}</TableCell>
                <TableCell>{item.billNumber || "N/A"}</TableCell>
                <TableCell>{formatDate(item.billDate)}</TableCell>
                <TableCell>{item.companyName || "N/A"}</TableCell>
                <TableCell>{item.radiotherapyCycles || "N/A"}</TableCell>

                {editingRow === item.billNumber ? (
                  <>
                    <TableCell>
                      <Input
                        type="number"
                        name="billAmount"
                        value={editValues.billAmount}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        name="claimedAmount"
                        value={editValues.claimedAmount}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        name="pendingAmount"
                        value={editValues.pendingAmount}
                        onChange={handleInputChange}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <Label>Payment Type:</Label>
                        <Select
                          name="paymentType"
                          value={editValues.paymentType}
                          onChange={handleInputChange}
                          style={{ width: "100%", marginBottom: "10px" }}
                        >
                          <option value="Partial Payment">Partial Payment</option>
                          <option value="Full Payment">Full Payment</option>
                          <option value="Adjustment">Adjustment</option>
                          <option value="Refund">Refund</option>
                        </Select>

                        <Label>Payment Amount:</Label>
                        <Input
                          type="number"
                          name="paymentAmount"
                          value={editValues.paymentAmount}
                          onChange={handleInputChange}
                          placeholder="Enter amount paid"
                        />
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
                      <PendingAmount
                        value={
                          Number.parseFloat(item.pendingAmount) ||
                          calculatePendingAmount(
                            Number.parseFloat(item.billAmount) || 0,
                            Number.parseFloat(item.claimedAmount) || 0,
                          )
                        }
                      >
                        {(
                          Number.parseFloat(item.pendingAmount) ||
                          calculatePendingAmount(
                            Number.parseFloat(item.billAmount) || 0,
                            Number.parseFloat(item.claimedAmount) || 0,
                          )
                        ).toFixed(2)}
                      </PendingAmount>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(item)}>Edit</Button>
                      {item.editHistory && item.editHistory.length > 0 && (
                        <Button onClick={() => viewEditHistory(item)}>
                          History
                          <Badge>{item.editHistory.length}</Badge>
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
              <ModalValue
                positive={Number(editValues.pendingAmount) > 0}
                negative={Number(editValues.pendingAmount) < 0}
              >
                {Number(editValues.pendingAmount).toFixed(2)}
              </ModalValue>
            </ModalRow>

            <ModalRow>
              <ModalLabel>Payment Type:</ModalLabel>
              <Select
                name="paymentType"
                value={editValues.paymentType}
                onChange={handleInputChange}
                style={{ width: "60%" }}
              >
                <option value="Partial Payment">Partial Payment</option>
                <option value="Full Payment">Full Payment</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Refund">Refund</option>
              </Select>
            </ModalRow>

            <ModalRow>
              <ModalLabel>Payment Amount:</ModalLabel>
              <Input
                type="number"
                name="paymentAmount"
                value={editValues.paymentAmount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                style={{ width: "60%" }}
              />
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
                    <span>
                      {edit.previousBillAmount || "0"} → {edit.newBillAmount}
                    </span>
                  </EditHistoryDetails>
                  <EditHistoryDetails>
                    <span>Claimed Amount:</span>
                    <span>
                      {edit.previousClaimedAmount || "0"} → {edit.newClaimedAmount}
                    </span>
                  </EditHistoryDetails>
                  <EditHistoryDetails>
                    <span>Pending Amount:</span>
                    <span>
                      {edit.previousPendingAmount || "0"} → {edit.newPendingAmount}
                    </span>
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
            <Button onClick={closeEditHistory} style={{ marginTop: "15px" }}>
              Close
            </Button>
          </EditHistoryContainer>
        </>
      )}
    </Container>
  )
}

export default RadiotherapyReport
