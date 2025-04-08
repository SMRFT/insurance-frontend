"use client"

import styled from "styled-components"
import { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import InsuranceCompanies from "./InsuranceConstants" // Import the insurance companies
import { useLocation } from "react-router-dom"

// Colors
const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"

// Styled components
// Update the FormWrapper to use a more subtle gradient
const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${backgroundColor} 0%, ${accentColor}40 100%);
  padding: 40px 20px;
`

// Update the FormContainer for a more modern look
const FormContainer = styled.div`
  background-color: #FFFFFF;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1000px;
  transition: all 0.3s ease;
`

// Update the Title styling
const Title = styled.h2`
  text-align: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 40px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${accentColor};
    border-radius: 2px;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

// New styled components for better grouping
// Update FormSection for better visual hierarchy
const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
`

// Update SectionTitle for better visual hierarchy
const SectionTitle = styled.h3`
  color: ${primaryColor};
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 1px solid ${accentColor}80;
  padding-bottom: 10px;
`

// Update CenteredContainer to match the new style
const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 25px;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
`

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${textColor};
  margin-bottom: 8px;
  font-family: 'Roboto', sans-serif;
  display: block;
`

// Update Input for a more modern look
const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #fafafa;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }
`

// Update Select to match Input styling
const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background-color: #fafafa;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }
`

// Update RadioGroup for better alignment
const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
`

// Update RadioLabel for better styling
const RadioLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    accent-color: ${primaryColor};
    width: 16px;
    height: 16px;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`

// Update Button for a more modern look
const Button = styled.button`
  padding: 14px 36px;
  background-color: ${primaryColor};
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px ${primaryColor}40;

  &:hover {
    background-color: ${accentColor};
    transform: translateY(-3px);
    box-shadow: 0 6px 15px ${primaryColor}40;
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px ${primaryColor}40;
  }
`

function InsuranceForm() {
  const location = useLocation()
  const formDataFromUpdate = location.state || {}

  const [formData, setFormData] = useState({
    patient_uhid: "",
    patient_name: "",
    billNumber: "",
    date: "",
    companyName: "",
    specificInsuranceCompany: "",
    dateOfDischarge: "",
    billingFile: null,
    queryUpload: null,
    queryResponse: null,
    submissionStatus: "Online",
    approvalAmount: "",
    claimedAmount: "",
    settledAmount: "",
    approval: "As per norm",
    followUp: "",
    reasonNotMatch: "",
    claimOption: "Not Claim",
    claimDetails: "",
    notClaimReason: "",
    opIpSelection: "OP",
    opIpNumber: "",
    billDate: "",
    billAmount: "",
    fileSubmissionDate: "",
    queryDate: "",
    approvalDate: "",
    remarks: "",
  })

  // Load form data from navigation state when component mounts
  useEffect(() => {
    if (Object.keys(formDataFromUpdate).length > 0) {
      const newFormData = { ...formData }

      // Map all fields from the navigation state to the form
      Object.keys(formDataFromUpdate).forEach((key) => {
        if (key in newFormData) {
          // Handle file inputs specially (they can't be pre-populated)
          if (key !== "billingFile" && key !== "queryUpload" && key !== "queryResponse") {
            newFormData[key] = formDataFromUpdate[key]
          }
        }
      })

      // Set OP/IP selection based on available data
      if (formDataFromUpdate.opNumber) {
        newFormData.opIpSelection = "OP"
        newFormData.opIpNumber = formDataFromUpdate.opNumber
      } else if (formDataFromUpdate.ipNumber) {
        newFormData.opIpSelection = "IP"
        newFormData.opIpNumber = formDataFromUpdate.ipNumber
      }

      setFormData(newFormData)
    }
  }, [formDataFromUpdate])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple validation
    if (!formData.patient_uhid || !formData.patient_name || !formData.billNumber) {
      alert("Please fill out all required fields!")
      return
    }

    // Prepare formData for submission
    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === "opIpNumber") {
        // Dynamically add either opNumber or ipNumber based on selection
        const selectionKey = formData.opIpSelection === "OP" ? "opNumber" : "ipNumber"
        formDataToSend.append(selectionKey, formData[key])
      } else if (formData[key] !== null) {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      let response

      if (formDataFromUpdate.billNumber) {
        // This is an update operation
        response = await fetch(`http://127.0.0.1:8000/insurance/update/${formData.billNumber}/`, {
          method: "PUT",
          body: formDataToSend,
        })
      } else {
        // This is a new submission
        response = await fetch("http://127.0.0.1:8000/insurance/", {
          method: "POST",
          body: formDataToSend,
        })
      }

      if (response.ok) {
        alert(formDataFromUpdate.billNumber ? "Form updated successfully!" : "Form submitted successfully!")

        if (!formDataFromUpdate.billNumber) {
          // Only reset form if it was a new submission, not an update
          setFormData({
            patient_uhid: "",
            patient_name: "",
            billNumber: "",
            date: "",
            companyName: "",
            specificInsuranceCompany: "",
            dateOfDischarge: "",
            billingFile: null,
            queryUpload: null,
            queryResponse: null,
            submissionStatus: "Online",
            approvalAmount: "",
            claimedAmount: "",
            settledAmount: "",
            approval: "As per norm",
            followUp: "",
            reasonNotMatch: "",
            claimOption: "Not Claim",
            claimDetails: "",
            notClaimReason: "",
            opIpSelection: "OP",
            opIpNumber: "",
            billDate: "",
            billAmount: "",
            fileSubmissionDate: "",
            queryDate: "",
            approvalDate: "",
            remarks: "",
          })
        }
      } else {
        const errorData = await response.json()
        alert(`Failed: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <FormWrapper>
      <FormContainer>
        <Title>{formDataFromUpdate.billNumber ? "Update Insurance Form" : "Insurance Form"}</Title>
        <Form onSubmit={handleSubmit}>
          {/* Patient Information Section */}
          <FormSection>
            <SectionTitle>Patient Information</SectionTitle>
            <Row>
              <Col sm={4}>
                <Label>Patient UHID</Label>
                <Input type="text" name="patient_uhid" value={formData.patient_uhid} onChange={handleChange} />
              </Col>
              <Col sm={4}>
                <Label>Patient Name</Label>
                <Input type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} />
              </Col>
              <Col sm={4}>
                <Label>OP or IP</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="opIpSelection"
                      value="OP"
                      checked={formData.opIpSelection === "OP"}
                      onChange={handleChange}
                    />
                    OP
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="opIpSelection"
                      value="IP"
                      checked={formData.opIpSelection === "IP"}
                      onChange={handleChange}
                    />
                    IP
                  </RadioLabel>
                </RadioGroup>
                {formData.opIpSelection && (
                  <>
                    <Label>{formData.opIpSelection === "OP" ? "OP Number" : "IP Number"}</Label>
                    <Input
                      type="text"
                      name="opIpNumber"
                      value={formData.opIpNumber}
                      onChange={handleChange}
                      placeholder={`Enter ${formData.opIpSelection} Number`}
                    />
                  </>
                )}
              </Col>
            </Row>
          </FormSection>

          {/* Billing Information Section */}
          <FormSection>
            <SectionTitle>Billing Information</SectionTitle>
            <Row>
              <Col sm={3}>
                <Label>Bill Number</Label>
                <Input type="text" name="billNumber" value={formData.billNumber} onChange={handleChange} />
              </Col>
              <Col sm={3}>
                <Label>Bill Date</Label>
                <Input type="date" name="billDate" value={formData.billDate} onChange={handleChange} />
              </Col>
              <Col sm={3}>
                <Label>Bill Amount</Label>
                <Input type="text" name="billAmount" value={formData.billAmount} onChange={handleChange} />
              </Col>
              <Col sm={3}>
                <Label>Date</Label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} />
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Label>Billing Done</Label>
                <Input type="file" name="billingFile" onChange={handleChange} />
              </Col>
              <Col sm={6}>
                <Label>Date of Discharge</Label>
                <Input type="date" name="dateOfDischarge" value={formData.dateOfDischarge} onChange={handleChange} />
              </Col>
            </Row>
          </FormSection>

          {/* Insurance Company Section */}
          <FormSection>
            <SectionTitle>Insurance Company Details</SectionTitle>
            <Row>
              <Col sm={6}>
                <Label>Company Name</Label>
                <Select name="companyName" value={formData.companyName} onChange={handleChange}>
                  <option value="">Select Company</option>
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
              </Col>

              {/* Conditional Field for Specific Insurance Company */}
              {formData.companyName === "General Insurance" && (
                <Col sm={6}>
                  <Label>Select Insurance Provider</Label>
                  <Select
                    name="specificInsuranceCompany"
                    value={formData.specificInsuranceCompany}
                    onChange={handleChange}
                  >
                    <option value="">Select Insurance Provider</option>
                    {InsuranceCompanies.map((company, index) => (
                      <option key={index} value={company}>
                        {company}
                      </option>
                    ))}
                  </Select>
                </Col>
              )}
            </Row>
          </FormSection>

          {/* Submission Details Section */}
          <FormSection>
            <SectionTitle>Submission Details</SectionTitle>
            <Row>
              <Col sm={4}>
                <Label>File Submission Date</Label>
                <Input
                  type="date"
                  name="fileSubmissionDate"
                  value={formData.fileSubmissionDate}
                  onChange={handleChange}
                />
              </Col>
              <Col sm={4}>
                <Label>Submission Status</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="submissionStatus"
                      value="Online"
                      checked={formData.submissionStatus === "Online"}
                      onChange={handleChange}
                    />
                    Online
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="submissionStatus"
                      value="Physical"
                      checked={formData.submissionStatus === "Physical"}
                      onChange={handleChange}
                    />
                    Physical
                  </RadioLabel>
                </RadioGroup>
              </Col>
              <Col sm={4}>
                <Label>Approval Date</Label>
                <Input type="date" name="approvalDate" value={formData.approvalDate} onChange={handleChange} />
              </Col>
            </Row>
          </FormSection>

          {/* Query Information Section */}
          <FormSection>
            <SectionTitle>Query Information</SectionTitle>
            <Row>
              <Col sm={4}>
                <Label>Query Date/Return File Date</Label>
                <Input type="date" name="queryDate" value={formData.queryDate} onChange={handleChange} />
              </Col>
              <Col sm={4}>
                <Label>Query Upload</Label>
                <Input type="file" name="queryUpload" onChange={handleChange} />
              </Col>
              <Col sm={4}>
                <Label>Query Response</Label>
                <Input type="file" name="queryResponse" onChange={handleChange} />
              </Col>
            </Row>
          </FormSection>

          {/* Financial Details Section */}
          <FormSection>
            <SectionTitle>Financial Details</SectionTitle>
            <Row>
              <Col sm={4}>
                <Label>Approval Amount</Label>
                <Input type="text" name="approvalAmount" value={formData.approvalAmount} onChange={handleChange} />
              </Col>
              <Col sm={4}>
                <Label>Claimed Amount</Label>
                <Input type="text" name="claimedAmount" value={formData.claimedAmount} onChange={handleChange} />
              </Col>
              <Col sm={4}>
                <Label>Settled Amount</Label>
                <Input type="text" name="settledAmount" value={formData.settledAmount} onChange={handleChange} />
              </Col>
            </Row>
          </FormSection>

          {/* Approval Section */}
          <CenteredContainer>
            <Label>Approval</Label>
            <Select name="approval" value={formData.approval} onChange={handleChange}>
              <option value="As per norm">As per norm</option>
              <option value="Not per norms">Not per norms</option>
            </Select>
          </CenteredContainer>

          {/* Conditional fields for "Not per norms" */}
          {formData.approval === "Not per norms" && (
            <FormSection>
              <SectionTitle>Additional Information</SectionTitle>
              <Row>
                <Col sm={6}>
                  <Label>Follow Up</Label>
                  <Input type="text" name="followUp" value={formData.followUp} onChange={handleChange} />
                </Col>
                <Col sm={6}>
                  <Label>Reason for Not Match</Label>
                  <Input type="text" name="reasonNotMatch" value={formData.reasonNotMatch} onChange={handleChange} />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Label>Claim Option</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="claimOption"
                        value="Claim"
                        checked={formData.claimOption === "Claim"}
                        onChange={handleChange}
                      />
                      Claim
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="claimOption"
                        value="Not Claim"
                        checked={formData.claimOption === "Not Claim"}
                        onChange={handleChange}
                      />
                      Not Claim
                    </RadioLabel>
                  </RadioGroup>
                </Col>
                <Col sm={6}>
                  {/* Input fields for both Claim and Not Claim */}
                  {formData.claimOption === "Claim" && (
                    <>
                      <Label>Claim Details</Label>
                      <Input type="text" name="claimDetails" value={formData.claimDetails} onChange={handleChange} />
                    </>
                  )}
                  {formData.claimOption === "Not Claim" && (
                    <>
                      <Label>Reason for Not Claim</Label>
                      <Input
                        type="text"
                        name="notClaimReason"
                        value={formData.notClaimReason}
                        onChange={handleChange}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </FormSection>
          )}

          {/* Remarks Section */}
          <FormSection>
            <SectionTitle>Remarks</SectionTitle>
            <Row>
              <Col sm={12}>
                <Label>Remarks</Label>
                <Input
                  type="textarea"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  style={{ minHeight: "100px" }}
                />
              </Col>
            </Row>
          </FormSection>

          <ButtonWrapper>
            <Button type="submit">{formDataFromUpdate.billNumber ? "Update" : "Submit"}</Button>
          </ButtonWrapper>
        </Form>
      </FormContainer>
    </FormWrapper>
  )
}

export default InsuranceForm

