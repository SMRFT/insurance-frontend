"use client"

import { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast'
import {
  FormWrapper,
  FormContainer,
  Title,
  Form,
  FormSection,
  SectionTitle,
  Label,
  Input,
  Select,
  Button,
  ButtonWrapper,
  RadioGroup,
  RadioLabel,
  CenteredContainer,
} from "./SharedStyledComponents"
import apiRequest from "./ApiRequest"

function InsuranceForm() {
  const location = useLocation()
  const formDataFromUpdate = location.state || {}
  const [insuranceCompanies, setInsuranceCompanies] = useState([])
  const [opIpNumberManuallyChanged, setOpIpNumberManuallyChanged] = useState(false)
  const [formData, setFormData] = useState({
    patient_uhid: "",
    patient_name: "",
    billNumber: "",
    date: "",
    dateOfDischarge: "",
    companyName: "",
    specificInsuranceCompany: "",
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
    treatmentType: "",
    radiotherapyCycles: "",
    claimId: "",
  })

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_insurance_companies/`)
        if (result.success) {
          setInsuranceCompanies(result.data)
          toast.success("Insurance companies loaded successfully!")
        } else {
          console.error("Error fetching insurance companies:", result.error)
          toast.error("Failed to load insurance companies")
        }
      } catch (error) {
        console.error("Network error:", error)
        toast.error("Network error while loading insurance companies")
      }
    }
    fetchInsuranceCompanies()
  }, [])

  useEffect(() => {
    if (Object.keys(formDataFromUpdate).length > 0) {
      const newFormData = { ...formData }
      Object.keys(formDataFromUpdate).forEach((key) => {
        if (key in newFormData) {
          if (key !== "billingFile" && key !== "queryUpload" && key !== "queryResponse") {
            newFormData[key] = formDataFromUpdate[key]
          }
        }
      })
      if (formDataFromUpdate.opNumber) {
        newFormData.opIpSelection = "OP"
        newFormData.opIpNumber = formDataFromUpdate.opNumber
      } else if (formDataFromUpdate.ipNumber) {
        newFormData.opIpSelection = "IP"
        newFormData.opIpNumber = formDataFromUpdate.ipNumber
      }
      setFormData(newFormData)
      setOpIpNumberManuallyChanged(true)
      toast.success("Form loaded for editing")
    }
  }, [formDataFromUpdate])

  useEffect(() => {
    if (
      Object.keys(formDataFromUpdate).length === 0 &&
      formData.patient_uhid &&
      !opIpNumberManuallyChanged &&
      formData.opIpSelection === "OP" &&
      formData.opIpNumber !== formData.patient_uhid
    ) {
      setFormData((prevData) => ({
        ...prevData,
        opIpNumber: formData.patient_uhid,
      }))
    }
  }, [
    formData.patient_uhid,
    formDataFromUpdate,
    opIpNumberManuallyChanged,
    formData.opIpSelection,
    formData.opIpNumber,
  ])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (name === "opIpNumber" || name === "opIpSelection") {
      setOpIpNumberManuallyChanged(true)
    }

    if (name === "patient_uhid" && !Object.keys(formDataFromUpdate).length) {
      if (!opIpNumberManuallyChanged) {
        setFormData({
          ...formData,
          [name]: value,
          opIpSelection: "OP",
          opIpNumber: value,
        })
      } else {
        setFormData({
          ...formData,
          [name]: value,
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "file" ? files[0] : value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isUpdate = Object.keys(formDataFromUpdate).length > 0

    // Validation
    if (!formData.patient_uhid || !formData.patient_name) {
      toast.error("Please fill out all required fields!")
      return
    }

    // Show loading toast
    const loadingToast = toast.loading(isUpdate ? "Updating form..." : "Submitting form...")

    try {
      // Prepare FormData
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        if (
          key !== "billingFile" &&
          key !== "queryUpload" &&
          key !== "queryResponse" &&
          key !== "opIpSelection" &&
          key !== "opIpNumber" &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key])
        }
      })

      if (formData.opIpSelection === "OP" && formData.opIpNumber) {
        formDataToSend.append("opNumber", formData.opIpNumber)
      } else if (formData.opIpSelection === "IP" && formData.opIpNumber) {
        formDataToSend.append("ipNumber", formData.opIpNumber)
      }

      // Handle file uploads with feedback
      if (formData.billingFile && formData.billingFile instanceof File) {
        formDataToSend.append("billingFile", formData.billingFile)
        toast.success(`📎 Billing file "${formData.billingFile.name}" attached`)
      }
      
      if (formData.queryUpload && formData.queryUpload instanceof File) {
        formDataToSend.append("queryUpload", formData.queryUpload)
        toast.success(`📎 Query file "${formData.queryUpload.name}" attached`)
      }
      
      if (formData.queryResponse && formData.queryResponse instanceof File) {
        formDataToSend.append("queryResponse", formData.queryResponse)
        toast.success(`📎 Response file "${formData.queryResponse.name}" attached`)
      }

      let apiResult
      let updateIdentifier = ""

      if (isUpdate) {
        if (formDataFromUpdate.opNumber) {
          updateIdentifier = formDataFromUpdate.opNumber
        } else if (formDataFromUpdate.ipNumber) {
          updateIdentifier = formDataFromUpdate.ipNumber
        } else if (formDataFromUpdate.billNumber) {
          updateIdentifier = formDataFromUpdate.billNumber
        }

        if (updateIdentifier) {
          const updateEndpoint = `${Insurancebaseurl}insurance/update/${encodeURIComponent(updateIdentifier)}/`
          apiResult = await apiRequest(updateEndpoint, "PUT", formDataToSend, true, {})
        } else {
          toast.dismiss(loadingToast)
          toast.error("❌ No valid identifier found for update")
          return
        }
      } else {
        apiResult = await apiRequest(`${Insurancebaseurl}insurance/`, "POST", formDataToSend, true, {})
      }

      toast.dismiss(loadingToast)

      if (apiResult.success) {
        console.log("Response data:", apiResult.data)
        
        // Success toast with custom styling
        toast.success(
          isUpdate ? "✅ Form updated successfully!" : "🎉 Form submitted successfully!", 
          {
            duration: 4000,
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#10b981',
            },
          }
        )

        if (!isUpdate) {
          // Reset form for new submissions
          setFormData({
            patient_uhid: "",
            patient_name: "",
            billNumber: "",
            date: "",
            dateOfDischarge: "",
            companyName: "",
            specificInsuranceCompany: "",
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
            treatmentType: "",
            radiotherapyCycles: "",
            claimId: "",
          })
          setOpIpNumberManuallyChanged(false)
          toast.success("📝 Form reset for new entry")
        }
      } else {
        console.error("Error response:", apiResult.error)
        toast.error(
          `❌ Failed: ${apiResult.error}`, 
          {
            duration: 6000,
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
          }
        )
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Exception:", error)
      toast.error(
        `💥 Error: ${error.message}`, 
        {
          duration: 6000,
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        }
      )
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <FormWrapper>
      <FormContainer>
        <Title>{formDataFromUpdate.opNumber ? "Update Insurance Form" : "Insurance Form"}</Title>
        
        {/* Toast Container */}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: '',
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
                secondary: 'black',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ff6b6b',
                secondary: 'white',
              },
            },
            loading: {
              theme: {
                primary: '#4f46e5',
                secondary: 'white',
              },
            },
          }}
        />

        <Form onSubmit={handleSubmit}>
          {/* Patient Information Section */}
          <FormSection>
            <SectionTitle>Patient Information</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Date</Label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} max={getTodayDate()} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Patient UHID</Label>
                <Input type="text" name="patient_uhid" value={formData.patient_uhid} onChange={handleChange} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Patient Name</Label>
                <Input type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
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
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Bill Number</Label>
                <Input type="text" name="billNumber" value={formData.billNumber} onChange={handleChange} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Bill Date</Label>
                <Input
                  type="date"
                  name="billDate"
                  value={formData.billDate}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Bill Amount</Label>
                <Input type="text" name="billAmount" value={formData.billAmount} onChange={handleChange} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Billing Done</Label>
                <Input
                  type="file"
                  name="billingFile"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleChange}
                />
                {formData.billingFile && (
                  <small style={{ color: '#10b981', fontSize: '12px' }}>
                    ✅ Selected: {formData.billingFile.name}
                  </small>
                )}
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Date Of Discharge</Label>
                <Input
                  type="date"
                  name="dateOfDischarge"
                  value={formData.dateOfDischarge}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
              </Col>
              <Col xs={12} sm={6} md={6} lg={3}>
                <Label>Claim Id</Label>
                <Input type="text" name="claimId" value={formData.claimId} onChange={handleChange} />
              </Col>
            </Row>
          </FormSection>
          
          {/* Insurance Company Section */}
          <FormSection>
            <SectionTitle>Insurance Company Details</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={12} md={6} lg={6}>
                <Label>Company Name</Label>
                <Select name="companyName" value={formData.companyName} onChange={handleChange}>
                  <option value="">Select Company</option>
                  <option value="General Insurance">General Insurance</option>
                  <option value="ECHS">ECHS</option>
                  <option value="ESI">ESI</option>
                  <option value="ESIC">ESIC</option>
                  <option value="Railway CTSE">Railway CTSE</option>
                  <option value="TKT">TKT</option>
                  <option value="FCI">FCI</option>
                  <option value="Airport">Airport</option>
                </Select>
              </Col>
              {formData.companyName === "General Insurance" && (
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Label>Select Insurance Provider</Label>
                  <Select
                    name="specificInsuranceCompany"
                    value={formData.specificInsuranceCompany}
                    onChange={handleChange}
                  >
                    <option value="">Select Insurance Provider</option>
                    {insuranceCompanies.map((company, index) => (
                      <option key={index} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </Col>
              )}
            </Row>
          </FormSection>
          
          {/* Treatment Information Section */}
          <FormSection>
            <SectionTitle>Treatment Information</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={12} md={6} lg={6}>
                <Label>Treatment Type</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="treatmentType"
                      value="Radiotherapy"
                      checked={formData.treatmentType === "Radiotherapy"}
                      onChange={handleChange}
                    />
                    Radiotherapy
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="treatmentType"
                      value="Chemotherapy"
                      checked={formData.treatmentType === "Chemotherapy"}
                      onChange={handleChange}
                    />
                    Chemotherapy
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="treatmentType"
                      value="Other"
                      checked={formData.treatmentType === "Other"}
                      onChange={handleChange}
                    />
                    Other
                  </RadioLabel>
                </RadioGroup>
              </Col>
              {formData.treatmentType === "Radiotherapy" && (
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Label>Number of Cycles</Label>
                  <Input
                    type="number"
                    name="radiotherapyCycles"
                    value={formData.radiotherapyCycles}
                    onChange={handleChange}
                    placeholder="Enter number of cycles"
                  />
                </Col>
              )}
            </Row>
          </FormSection>
          
          {/* Submission Details Section */}
          <FormSection>
            <SectionTitle>Submission Details</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>File Submission Date</Label>
                <Input
                  type="date"
                  name="fileSubmissionDate"
                  value={formData.fileSubmissionDate}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
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
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Approval Date</Label>
                <Input
                  type="date"
                  name="approvalDate"
                  value={formData.approvalDate}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
              </Col>
            </Row>
          </FormSection>
          
          {/* Query Information Section */}
          <FormSection>
            <SectionTitle>Query Information</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Query Date/Return File Date</Label>
                <Input
                  type="date"
                  name="queryDate"
                  value={formData.queryDate}
                  onChange={handleChange}
                  max={getTodayDate()}
                />
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Query Upload</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  name="queryUpload"
                  onChange={handleChange}
                />
                {formData.queryUpload && (
                  <small style={{ color: '#10b981', fontSize: '12px' }}>
                    ✅ Selected: {formData.queryUpload.name}
                  </small>
                )}
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Query Response</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  name="queryResponse"
                  onChange={handleChange}
                />
                {formData.queryResponse && (
                  <small style={{ color: '#10b981', fontSize: '12px' }}>
                    ✅ Selected: {formData.queryResponse.name}
                  </small>
                )}
              </Col>
            </Row>
          </FormSection>
          
          {/* Financial Details Section */}
          <FormSection>
            <SectionTitle>Financial Details</SectionTitle>
            <Row
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                alignItems: "center",
              }}
              className="responsive-row"
            >
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Approval Amount</Label>
                <Input type="text" name="approvalAmount" value={formData.approvalAmount} onChange={handleChange} />
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <Label>Claimed Amount</Label>
                <Input type="text" name="claimedAmount" value={formData.claimedAmount} onChange={handleChange} />
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
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
              <Row
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "20px",
                  alignItems: "center",
                }}
                className="responsive-row"
              >
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Label>Follow Up</Label>
                  <Input type="text" name="followUp" value={formData.followUp} onChange={handleChange} />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Label>Reason for Not Match</Label>
                  <Input type="text" name="reasonNotMatch" value={formData.reasonNotMatch} onChange={handleChange} />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
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
                <Col xs={12} sm={6} md={6} lg={3}>
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
              <Col xs={12}>
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
      
      <style>{`
        @media (max-width: 991px) {
          .responsive-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 767px) {
          .responsive-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </FormWrapper>
  )
}

export default InsuranceForm