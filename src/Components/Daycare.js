"use client"

import { useState,useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import styled from "styled-components"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

// Sample insurance companies list - replace with your actual import
const InsuranceCompanies = [
  "Acko General Insurance Company",
  "Aditya Birla General Insurance Company",
  "Bajaj Allianz General Insurance Company",
  "Care Health Insurance",
  "Cholamandalam MS General Insurance",
  "Digit Insurance",
  "East West Assist Insurance TPA Private Limited",
  "Ericson Insurance TPA Pvt. Ltd.",
  "Family Health Plan TPA Limited",
  "Future Generali General Insurance",
  "Good Health Insurance TPA Ltd",
  "HDFC ERGO General Insurance Company",
  "Health Insurance TPA of India Ltd",
  "HealthIndia Insurance TPA Services Pvt. Ltd.",
  "Heritage Health Insurance TPA Pvt Ltd",
  "ICICI Lombard General Insurance Company Limited",
  "IFFCO Tokio General Insurance Company Limited",
  "Liberty General insurance Limited",
  "ManipalCigna Health Insurance Company Ltd",
  "MDIndia Health Insurance TPA Private Limited",
  "MD India - Govt",
  "MD India - Pensioner",
  "Medi Assist Insurance TPA Private Limited",
  "Medi Assist - Govt",
  "Medi Assist - Pensioner",
  "Med Save Insurance TPA Pvt., Ltd.,",
  "Medvantage Insurance TPA",
  "Navi General Insurance",
  "TNNHIS",
  "Niva Bupa General Insurance",
  "Paramount Health Services And Insurance TPA",
  "Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
  "Raksha Health Insurance TPA Pvt Ltd",
  "Reliance General Insurance",
  "SafeWay Insurance TPA Pvt., Ltd.,",
  "SBI General Insurance",
  "Star Health and Allied Insurance",
  "Tata AIG General Insurance Company Limited",
  "Universal Sompo General Insurance Company Ltd",
  "Vidal Health Insurance TPA"
]

const primaryColor = "#6F8B83"
const backgroundColor = "#F9F9F9"
const textColor = "#333"
const accentColor = "#9aaea9"

const FormWrapper = styled.div`
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`

const FormTitle = styled.h2`
  color: ${primaryColor};
  margin-bottom: 25px;
  font-weight: 600;
  text-align: center;
`

const FormLabel = styled.label`
  font-weight: 500;
  color: ${textColor};
  margin-bottom: 8px;
  font-size: 14px;
`

const SectionTitle = styled.h4`
  color: ${primaryColor};
  margin-bottom: 15px;
  font-weight: 500;
`

const Button = styled.button`
  padding: 8px 24px;
  border: none;
  background-color: ${primaryColor};
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${accentColor};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`

const Daycare = () => {
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [formData, setFormData] = useState({
    admissionType: { ipNumber: "", opNumber: "" },
    patientName: "",
    uhid: "",
    doctorName: "",
    billType: "",
    claimId: "",
    opFile: null,
    submissionDate: "",
    claimDetails: "",
    billAmount: "",
    claimApproval: "",
    companyName: "",
    specificInsuranceCompany: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "ipNumber" || name === "opNumber") {
      setFormData({
        ...formData,
        admissionType: {
          ...formData.admissionType,
          [name]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })

      // Reset specificInsuranceCompany when companyName changes and is not "General Insurance"
      if (name === "companyName" && value !== "General Insurance") {
        setFormData((prevData) => ({
          ...prevData,
          specificInsuranceCompany: "",
        }))
      }
    }
  }
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const response = await axios.get("https://insurance.shinovadatabase.in/get_insurance_companies/");
        setInsuranceCompanies(response.data);
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
      }
    };

    fetchInsuranceCompanies();
  }, []);
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      opFile: e.target.files[0],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("admissionType", JSON.stringify(formData.admissionType))
    formDataToSend.append("patientName", formData.patientName)
    formDataToSend.append("uhid", formData.uhid)
    formDataToSend.append("doctorName", formData.doctorName)
    formDataToSend.append("billType", formData.billType)
    formDataToSend.append("claimId", formData.claimId)
    formDataToSend.append("opFile", formData.opFile)
    formDataToSend.append("submissionDate", formData.submissionDate)
    formDataToSend.append("claimDetails", formData.claimDetails)
    formDataToSend.append("billAmount", formData.billAmount)
    formDataToSend.append("claimApproval", formData.claimApproval)
    formDataToSend.append("companyName", formData.companyName)
    formDataToSend.append("specificInsuranceCompany", formData.specificInsuranceCompany)

    try {
      const response = await axios.post("https://insurance.shinovadatabase.in/submit-daycare/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 201) {
        toast.success("Form submitted successfully!")
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error)
      toast.error("There was an error submitting the form.")
    }
  }

  return (
    <div className="container mt-5">
      <FormWrapper>
        <FormTitle>Daycare</FormTitle>
        <form onSubmit={handleSubmit}>
          {/* First Row */}
          <div className="row mb-4">
            {/* Admission Type (IP Number & OP Number) */}
            <div className="col-md-3 mb-3">
              <FormLabel htmlFor="admissionType">Admission Type</FormLabel>
              <div className="d-flex">
                {/* IP Number */}
                <div className="col-6 pe-1">
                  <input
                    type="number"
                    className="form-control"
                    id="ipNumber"
                    name="ipNumber"
                    value={formData.admissionType.ipNumber}
                    onChange={handleChange}
                    placeholder="IP Number"
                  />
                </div>

                {/* OP Number */}
                <div className="col-6 ps-1">
                  <input
                    type="number"
                    className="form-control"
                    id="opNumber"
                    name="opNumber"
                    value={formData.admissionType.opNumber}
                    onChange={handleChange}
                    placeholder="OP Number"
                  />
                </div>
              </div>
            </div>

            {/* Patient Name */}
            <div className="col-md-3 mb-3">
              <FormLabel htmlFor="patientName">Patient Name</FormLabel>
              <input
                type="text"
                className="form-control"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
              />
            </div>

            {/* UHID */}
            <div className="col-md-3 mb-3">
              <FormLabel htmlFor="uhid">UHID</FormLabel>
              <input
                type="text"
                className="form-control"
                id="uhid"
                name="uhid"
                value={formData.uhid}
                onChange={handleChange}
              />
            </div>

            {/* Doctor Name */}
            <div className="col-md-3 mb-3">
              <FormLabel htmlFor="doctorName">Doctor Name</FormLabel>
              <input
                type="text"
                className="form-control"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Insurance Section */}
          <div className="row mb-4">
            <div className="col-12 mb-2">
              <SectionTitle>Insurance Company Details</SectionTitle>
            </div>

            {/* Company Type Selection */}
            <div className="col-md-6 mb-3">
              <FormLabel htmlFor="companyName">Company Name</FormLabel>
              <select
                className="form-select"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              >
                <option value="">Select Company</option>
                <option value="General Insurance">General Insurance</option>
                <option value="ECHS">ECHS</option>
                <option value="ESI">ESI</option>
                <option value="ESIC">ESIC</option>
                <option value="Railway CTSE">Railway CTSE</option>
                <option value="TKT">TKT</option>
                <option value="FCI">FCI</option>
                <option value="Airport">Airport</option>
              </select>
            </div>

            {/* Conditional Field for Specific Insurance Company */}
            {formData.companyName === "General Insurance" && (
        <div className="col-md-6 mb-3">
          <FormLabel htmlFor="specificInsuranceCompany">Select Insurance Provider</FormLabel>
          <select
            className="form-select"
            id="specificInsuranceCompany"
            name="specificInsuranceCompany"
            value={formData.specificInsuranceCompany}
            onChange={handleChange}
          >
            <option value="">Select Insurance Provider</option>
            {insuranceCompanies.map((company, index) => (
              <option key={index} value={company.name || company}>
                {company.name || company}
              </option>
            ))}
          </select>
        </div>
      )}
          </div>

          {/* Second Row */}
          <div className="row mb-4">
            {/* Bill Type */}
            <div className="col-md-2 mb-3">
              <FormLabel htmlFor="billType">Bill Type</FormLabel>
              <select
                className="form-select"
                id="billType"
                name="billType"
                value={formData.billType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Chemo">Chemo</option>
                <option value="Daycare">Daycare</option>
                <option value="Dialysis">Dialysis</option>
                <option value="HDR">HDR</option>
                <option value="RT">RT</option>
              </select>
            </div>

            {/* Claim ID */}
            <div className="col-md-2 mb-3">
              <FormLabel htmlFor="claimId">Claim ID</FormLabel>
              <input
                type="text"
                className="form-control"
                id="claimId"
                name="claimId"
                value={formData.claimId}
                onChange={handleChange}
              />
            </div>

            {/* File Upload */}
            <div className="col-md-2 mb-3">
              <FormLabel htmlFor="opFile">OP Document</FormLabel>
              <input type="file" className="form-control" id="opFile" name="opFile" onChange={handleFileChange} />
            </div>

            {/* Date Submission */}
            <div className="col-md-2 mb-3">
              <FormLabel htmlFor="submissionDate">Submission Date</FormLabel>
              <input
                type="date"
                className="form-control"
                id="submissionDate"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
              />
            </div>

            {/* Bill Amount */}
            <div className="col-md-2 mb-3">
              <FormLabel htmlFor="billAmount">Bill Amount</FormLabel>
              <input
                type="number"
                className="form-control"
                id="billAmount"
                name="billAmount"
                value={formData.billAmount}
                onChange={handleChange}
              />
            </div>

            {/* Claim Approval */}
            <div className="col-md-2 mb-3">
              <FormLabel htmlFor="claimApproval">Claim Approval</FormLabel>
              <select
                className="form-select"
                id="claimApproval"
                name="claimApproval"
                value={formData.claimApproval}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Third Row */}
          <div className="row mb-4">
            {/* Claim Details */}
            <div className="col-md-12 mb-3">
              <FormLabel htmlFor="claimDetails">Claim Details</FormLabel>
              <textarea
                className="form-control"
                id="claimDetails"
                name="claimDetails"
                rows="3"
                value={formData.claimDetails}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Centered Submit Button */}
          <div className="row mt-4">
            <div className="col-12 text-center">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </FormWrapper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Daycare

