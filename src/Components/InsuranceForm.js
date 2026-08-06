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
import SearchableSelect from "./SearchableSelect"

function InsuranceForm() {
  const location = useLocation()
  const formDataFromUpdate = location.state || {}
  const [insuranceCompanies, setInsuranceCompanies] = useState([])
  const [doctorsList, setDoctorsList] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [opIpNumberManuallyChanged, setOpIpNumberManuallyChanged] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [tempReason, setTempReason] = useState("")

  const getChangedFields = (original, current) => {
    const changes = [];
    const fieldsToCompare = Object.keys(current);

    fieldsToCompare.forEach(key => {
      if (["editHistory", "billingFile", "queryUpload", "queryResponse", "preauthFile", "opIpSelection", "opIpNumber"].includes(key)) return;

      const beforeVal = original[key] !== undefined && original[key] !== null ? original[key].toString().trim() : "";
      const afterVal = current[key] !== undefined && current[key] !== null ? current[key].toString().trim() : "";

      if (beforeVal !== afterVal) {
        const fieldLabels = {
          patient_uhid: "Patient UHID",
          patient_name: "Patient Name",
          doctorName: "Doctor Name",
          billNumber: "Bill Number",
          date: "Date",
          dateOfDischarge: "Discharge Date",
          companyName: "Company Name",
          specificInsuranceCompany: "Insurance Provider",
          submissionStatus: "Submission Status",
          approvalAmount: "Approval Amount",
          claimedAmount: "Claimed Amount",
          settledAmount: "Settled Amount",
          approval: "Approval Norms",
          followUp: "Follow Up Details",
          reasonNotMatch: "Reason for Not Matching",
          claimOption: "Claim Option",
          claimDetails: "Claim Details",
          notClaimReason: "Reason for Not Claiming",
          billDate: "Bill Date",
          billAmount: "Bill Amount",
          fileSubmissionDate: "File Submission Date",
          queryDate: "Query Date",
          approvalDate: "Approval Date",
          preauthRequestedDate: "Preauth Requested Date",
          preauthApprovedDate: "Preauth Approved Date",
          remarks: "Remarks",
          treatmentType: "Treatment Type",
          radiotherapyCycles: "Radiotherapy Cycles",
          otherTreatmentDetails: "Other Treatment Details",
          claimId: "Claim ID",
          voucherNumber: "Voucher Number",
          referral: "Referral Details",
          grossAmount: "Gross Amount",
          taxAmount: "Tax Amount",
          netAmount: "Net Amount",
          gst: "GST"
        };

        changes.push({
          field: fieldLabels[key] || key,
          before: beforeVal || "Empty",
          after: afterVal || "Empty"
        });
      }
    });

    // Compare OP/IP values specifically
    const origOpIp = original.opNumber || original.ipNumber || original.opIpNumber || "";
    const currOpIp = current.opIpNumber || "";
    if (origOpIp.toString().trim() !== currOpIp.toString().trim()) {
      changes.push({
        field: "OP/IP Number",
        before: origOpIp || "Empty",
        after: currOpIp || "Empty"
      });
    }

    return changes;
  };

  const [formData, setFormData] = useState({
    patient_uhid: "",
    patient_name: "",
    doctorName: "",
    billNumber: "",
    ctseType: "",
    date: "",
    dateOfDischarge: "",
    companyName: "",
    specificInsuranceCompany: "",
    billingFile: null,
    queryUpload: null,
    queryResponse: null,
    preauthRequestedDate: "",
    preauthApprovedDate: "",
    preauthFile: null,
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
    otherTreatmentDetails: "",
    claimId: "",
    voucherNumber: "",
    referral: "",
    grossAmount: "",
    taxAmount: "",
    netAmount: "",
    gst: "",
  })

  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_insurance_companies/`)
        if (result.success) {
          setInsuranceCompanies(result.data)
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
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const response = await apiRequest(`${Insurancebaseurl}get_doctor_list/`, "GET")
        let doctorsData = []
        if (Array.isArray(response)) {
          doctorsData = response
        } else if (response?.data && Array.isArray(response.data)) {
          doctorsData = response.data
        } else if (response?.doctors && Array.isArray(response.doctors)) {
          doctorsData = response.doctors
        } else {
          doctorsData = []
        }
        const activeDoctors = doctorsData.filter((d) => d.is_active !== false)
        const sortedDoctors = activeDoctors.sort((a, b) =>
          (a.doctor_name || "").trim().localeCompare((b.doctor_name || "").trim())
        )
        setDoctorsList(sortedDoctors)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setDoctorsList([])
      } finally {
        setLoadingDoctors(false)
      }
    }

    if (Insurancebaseurl) fetchDoctors()
  }, [Insurancebaseurl])

  useEffect(() => {
    if (Object.keys(formDataFromUpdate).length > 0) {
      const newFormData = { ...formData }
      Object.keys(formDataFromUpdate).forEach((key) => {
        if (key in newFormData) {
          if (key !== "billingFile" && key !== "queryUpload" && key !== "queryResponse" && key !== "preauthFile") {
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

    if (name === "companyName" && value === "Railway CTSE") {
      setFormData((prevData) => ({
        ...prevData,
        companyName: value,
        opIpSelection: "IP",
      }))
      return
    }

    if (name === "grossAmount") {
      const gross = parseFloat(value) || 0
      const tax = Math.round(gross * 0.1)
      const net = gross - tax
      setFormData((prevData) => ({
        ...prevData,
        grossAmount: value,
        taxAmount: value ? tax.toString() : "",
        netAmount: value ? net.toString() : "",
      }))
      return
    }

    if (name === "patient_uhid" && !Object.keys(formDataFromUpdate).length) {
      if (!opIpNumberManuallyChanged) {
        setFormData({
          ...formData,
          [name]: value,
          opIpSelection: formData.companyName === "Railway CTSE" ? "IP" : "OP",
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

  const executeSubmit = async (historyData = []) => {
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
          key !== "preauthFile" &&
          key !== "opIpSelection" &&
          key !== "opIpNumber" &&
          key !== "editHistory" &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key])
        }
      })

      if (isUpdate) {
        formDataToSend.append("editHistory", JSON.stringify(historyData))
      }

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

      if (formData.preauthFile && formData.preauthFile instanceof File) {
        formDataToSend.append("preauthFile", formData.preauthFile)
        toast.success(`📎 Preauth file "${formData.preauthFile.name}" attached`)
      }

      let apiResult
      let updateIdentifier = ""

      if (isUpdate) {
        if (formDataFromUpdate.id) {
          updateIdentifier = formDataFromUpdate.id
        } else if (formDataFromUpdate.opNumber) {
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
            ctseType: "",
            date: "",
            dateOfDischarge: "",
            companyName: formData.companyName,
            specificInsuranceCompany: "",
            billingFile: null,
            queryUpload: null,
            queryResponse: null,
            preauthRequestedDate: "",
            preauthApprovedDate: "",
            preauthFile: null,
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
            voucherNumber: "",
            referral: "",
            grossAmount: "",
            taxAmount: "",
            netAmount: "",
            gst: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isUpdate = Object.keys(formDataFromUpdate).length > 0
    if (isUpdate) {
      const changes = getChangedFields(formDataFromUpdate, formData)
      if (changes.length > 0) {
        setShowEditModal(true)
        return
      }
    }
    await executeSubmit(formDataFromUpdate.editHistory || [])
  }

  const handleModalConfirm = async (reason) => {
    setShowEditModal(false)
    const changes = getChangedFields(formDataFromUpdate, formData)
    const newHistoryItem = {
      edited_by: localStorage.getItem("employeeId") || localStorage.getItem("name") || "system",
      edited_date: new Date().toISOString(),
      edited_reason: reason,
      changes: changes
    }
    const updatedHistory = [...(formDataFromUpdate.editHistory || []), newHistoryItem]
    await executeSubmit(updatedHistory)
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
        

        <Form onSubmit={handleSubmit}>
          {formData.companyName === "Railway CTSE" ? (
            <>
              {/* Railway CTSE Specific Layout */}
              <FormSection>
                <SectionTitle>Railway CTSE Details</SectionTitle>
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
                    <Label>Company Name</Label>
                    <SearchableSelect
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Select Company"
                      options={[
                        "General Insurance",
                        "ECHS",
                        "ESI",
                        "ESIC",
                        "Railway CTSE",
                        "TKT",
                        "FCI",
                        "Airport"
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>CTSE Type</Label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', height: '38px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input type="radio" name="ctseType" value="Pensionary" checked={formData.ctseType === "Pensionary"} onChange={handleChange} /> Pensionary
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input type="radio" name="ctseType" value="Regular" checked={formData.ctseType === "Regular"} onChange={handleChange} /> Regular
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input type="radio" name="ctseType" value="All" checked={formData.ctseType === "All"} onChange={handleChange} /> All
                      </label>
                    </div>
                  </Col>
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
                    <Label>IP Number</Label>
                    <Input
                      type="text"
                      name="opIpNumber"
                      value={formData.opIpNumber}
                      onChange={handleChange}
                      placeholder="Enter IP Number"
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>Voucher Number</Label>
                    <Input type="text" name="voucherNumber" value={formData.voucherNumber} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>Referral</Label>
                    <Input type="text" name="referral" value={formData.referral} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>Gross Amount</Label>
                    <Input type="text" name="grossAmount" value={formData.grossAmount} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>Tax Amount 10%</Label>
                    <Input type="text" name="taxAmount" value={formData.taxAmount} readOnly style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }} />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>Net Amount</Label>
                    <Input type="text" name="netAmount" value={formData.netAmount} readOnly style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }} />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <Label>GST</Label>
                    <Input type="text" name="gst" value={formData.gst} onChange={handleChange} />
                  </Col>
                </Row>
              </FormSection>
            </>
          ) : (
            <>
              {/* 1. Patient Information Section */}
              <FormSection>
                <SectionTitle>1. Patient Information</SectionTitle>
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
                    <Label>Doctor Name</Label>
                    <SearchableSelect
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleChange}
                      disabled={loadingDoctors}
                      placeholder={loadingDoctors ? "Loading doctors..." : "Select Doctor"}
                      options={doctorsList.map((d) => d.doctor_name)}
                    />
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

              {/* 2. Insurance Details Section */}
              <FormSection>
                <SectionTitle>2. Insurance Details</SectionTitle>
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
                    <SearchableSelect
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Select Company"
                      options={[
                        "General Insurance",
                        "ECHS",
                        "ESI",
                        "ESIC",
                        "Railway CTSE",
                        "TKT",
                        "FCI",
                        "Airport"
                      ]}
                    />
                  </Col>
                  {formData.companyName === "General Insurance" && (
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <Label>Select Insurance Provider</Label>
                      <SearchableSelect
                        name="specificInsuranceCompany"
                        value={formData.specificInsuranceCompany}
                        onChange={handleChange}
                        placeholder="Select Insurance Provider"
                        options={insuranceCompanies.map((c) => c.name)}
                      />
                    </Col>
                  )}
                </Row>
              </FormSection>

              {/* 3. Treatment Information Section */}
              <FormSection>
                <SectionTitle>3. Treatment Information</SectionTitle>
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
                  {formData.treatmentType === "Other" && (
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <Label>Specify Other Treatment</Label>
                      <Input
                        type="text"
                        name="otherTreatmentDetails"
                        value={formData.otherTreatmentDetails}
                        onChange={handleChange}
                        placeholder="Enter treatment details"
                      />
                    </Col>
                  )}
                </Row>
              </FormSection>

              {/* 4. Preauth Information Section */}
              <FormSection>
                <SectionTitle>4. Preauth Information</SectionTitle>
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
                    <Label>Requested Date</Label>
                    <Input
                      type="date"
                      name="preauthRequestedDate"
                      value={formData.preauthRequestedDate}
                      onChange={handleChange}
                      max={getTodayDate()}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Approved Date</Label>
                    <Input
                      type="date"
                      name="preauthApprovedDate"
                      value={formData.preauthApprovedDate}
                      onChange={handleChange}
                      max={getTodayDate()}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Preauth File Upload</Label>
                    <Input
                      type="file"
                      name="preauthFile"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={handleChange}
                    />
                    {formData.preauthFile && (
                      <small style={{ color: '#10b981', fontSize: '12px' }}>
                        ✅ Selected: {formData.preauthFile.name}
                      </small>
                    )}
                  </Col>
                </Row>
              </FormSection>

              {/* 5. Discharge and Billing Information Section */}
              <FormSection>
                <SectionTitle>5. Discharge and Billing Information</SectionTitle>
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
                    <Label>Bill Number</Label>
                    <Input type="text" name="billNumber" value={formData.billNumber} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Bill Date</Label>
                    <Input
                      type="date"
                      name="billDate"
                      value={formData.billDate}
                      onChange={handleChange}
                      max={getTodayDate()}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Bill Amount</Label>
                    <Input type="text" name="billAmount" value={formData.billAmount} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
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
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Date Of Discharge</Label>
                    <Input
                      type="date"
                      name="dateOfDischarge"
                      value={formData.dateOfDischarge}
                      onChange={handleChange}
                      max={getTodayDate()}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Claim Id</Label>
                    <Input type="text" name="claimId" value={formData.claimId} onChange={handleChange} />
                  </Col>
                </Row>
              </FormSection>

              {/* 6. Submission Details Section */}
              <FormSection>
                <SectionTitle>6. Submission Details</SectionTitle>
                <Row
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    alignItems: "center",
                  }}
                  className="responsive-row"
                >
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Label>File Submission Date</Label>
                    <Input
                      type="date"
                      name="fileSubmissionDate"
                      value={formData.fileSubmissionDate}
                      onChange={handleChange}
                      max={getTodayDate()}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
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
                </Row>
              </FormSection>

              {/* 7. Query Information Section */}
              <FormSection>
                <SectionTitle>7. Query Information</SectionTitle>
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

              {/* 8. Claim Details Section */}
              <FormSection>
                <SectionTitle>8. Claim Details</SectionTitle>
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
                    <Label>Claimed Amount</Label>
                    <Input type="text" name="claimedAmount" value={formData.claimedAmount} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
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
                  <Col xs={12} sm={6} md={4} lg={4}>
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

              {/* 9. Approved Details Section */}
              <FormSection>
                <SectionTitle>9. Approved Details</SectionTitle>
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
                    <Label>Approval Date</Label>
                    <Input
                      type="date"
                      name="approvalDate"
                      value={formData.approvalDate}
                      onChange={handleChange}
                      max={getTodayDate()}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={4}>
                    <Label>Approval Norms</Label>
                    <SearchableSelect
                      name="approval"
                      value={formData.approval}
                      onChange={handleChange}
                      placeholder="Select Approval Norms"
                      options={["As per norm", "Not per norms"]}
                    />
                  </Col>
                  {formData.approval === "Not per norms" && (
                    <>
                      <Col xs={12} sm={6} md={4} lg={4}>
                        <Label>Follow Up</Label>
                        <Input type="text" name="followUp" value={formData.followUp} onChange={handleChange} />
                      </Col>
                      <Col xs={12} sm={6} md={4} lg={4}>
                        <Label>Reason for Not Match</Label>
                        <Input type="text" name="reasonNotMatch" value={formData.reasonNotMatch} onChange={handleChange} />
                      </Col>
                    </>
                  )}
                </Row>
              </FormSection>

              {/* 10. Settled Details Section */}
              <FormSection>
                <SectionTitle>10. Settled Details</SectionTitle>
                <Row
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    alignItems: "center",
                  }}
                  className="responsive-row"
                >
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Label>Settled Amount</Label>
                    <Input type="text" name="settledAmount" value={formData.settledAmount} onChange={handleChange} />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} style={{ gridColumn: "span 2" }}>
                    <Label>Remarks</Label>
                    <Input
                      type="textarea"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      style={{ minHeight: "80px" }}
                    />
                  </Col>
                </Row>
              </FormSection>
            </>
          )}

          <ButtonWrapper>
            <Button type="submit">{formDataFromUpdate.billNumber ? "Update" : "Submit"}</Button>
          </ButtonWrapper>
        </Form>
      </FormContainer>

      {showEditModal && (
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
            maxWidth: "500px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <h4 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "bold" }}>Reason for Modification</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Please provide a brief reason for editing this record to keep the audit history updated.</p>
            <textarea
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                resize: "vertical"
              }}
              placeholder="e.g. Corrected gross amount typo, updated claim status"
              value={tempReason}
              onChange={(e) => setTempReason(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
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
                onClick={() => {
                  setShowEditModal(false)
                  setTempReason("")
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#4f46e5",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
                onClick={() => {
                  if (!tempReason.trim()) {
                    toast.error("Please enter an edit reason!")
                    return
                  }
                  handleModalConfirm(tempReason)
                  setTempReason("")
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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