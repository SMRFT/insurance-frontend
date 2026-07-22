import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
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
} from "./SharedStyledComponents";
import apiRequest from "./ApiRequest";

const formatDateStr = (val) => {
  if (!val) return "";
  if (val.$date) return val.$date.split("T")[0];
  return typeof val === 'string' ? val.split('T')[0] : String(val).split('T')[0];
};

const RTForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state;

  const [formData, setFormData] = useState({
    patient_uhid: editData?.patient_uhid || "",
    patient_ip_number: editData?.patient_ip_number || "",
    patient_name: editData?.patient_name || "",
    date_of_admission: formatDateStr(editData?.date_of_admission),
    date_of_discharge: formatDateStr(editData?.date_of_discharge),
    insurance_type: editData?.insurance_type || "",
    specificInsuranceCompany: editData?.specificInsuranceCompany || "",
    amount_to_be_paid: editData?.amount_to_be_paid || "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempReason, setTempReason] = useState("");

  const getChangedFields = (original, currentPayload) => {
    const changes = [];
    const fieldMapping = {
      patient_uhid: "Patient UHID",
      patient_ip_number: "Patient IP Number",
      patient_name: "Patient Name",
      date_of_admission: "Admission Date",
      date_of_discharge: "Discharge Date",
      insurance_type: "Insurance Type",
      specificInsuranceCompany: "Insurance Provider",
      amount_to_be_paid: "Amount to be Paid",
    };

    Object.keys(fieldMapping).forEach(key => {
      let origVal = original[key] !== undefined && original[key] !== null ? original[key] : "";
      let currVal = currentPayload[key] !== undefined && currentPayload[key] !== null ? currentPayload[key] : "";
      
      if (key.startsWith("date_of_") && origVal) {
        origVal = formatDateStr(origVal);
      }
      if (key.startsWith("date_of_") && currVal) {
        currVal = formatDateStr(currVal);
      }

      const origStr = origVal.toString().trim();
      const currStr = currVal.toString().trim();
      
      if (origStr !== currStr) {
        changes.push({
          field: fieldMapping[key],
          before: origStr || "Empty",
          after: currStr || "Empty"
        });
      }
    });

    const origPayments = original.payment_details || [];
    const currPayments = currentPayload.payment_details || [];
    
    const normalizePayment = (p) => ({
      amount: Number(p.amount) || 0,
      payment_method: (p.payment_method || "").toString().trim(),
      upi_details: (p.payment_method || "").toString().trim() === "UPI" ? (p.upi_details || "").toString().trim() : "",
      date: (p.date || "").toString().trim()
    });

    const origNormalized = origPayments.map(normalizePayment);
    const currNormalized = currPayments.map(normalizePayment);

    if (JSON.stringify(origNormalized) !== JSON.stringify(currNormalized)) {
      changes.push({
        field: "Payment Details",
        before: origPayments.length ? `${origPayments.length} payment(s)` : "Empty",
        after: currPayments.length ? `${currPayments.length} payment(s)` : "Empty"
      });
    }

    return changes;
  };

  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const result = await apiRequest(`${Insurancebaseurl}get_insurance_companies/`);
        if (result.success) {
          setInsuranceCompanies(result.data);
        }
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
      }
    };
    fetchInsuranceCompanies();
  }, [Insurancebaseurl]);

  const initialPayments = editData?.payment_details?.length > 0
    ? editData.payment_details.map((p, i) => ({ ...p, upi_details: p.upi_details || "", id: Date.now() + i, isExisting: true }))
    : [{ id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "" }];

  const [paymentEntries, setPaymentEntries] = useState(initialPayments);

  const [loading, setLoading] = useState(false);

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentEntryChange = (id, field, value) => {
    setPaymentEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const addPaymentEntry = () => {
    setPaymentEntries((prev) => [
      ...prev,
      { id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "" },
    ]);
  };

  const removePaymentEntry = (id) => {
    setPaymentEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const calculateRemainingAmount = () => {
    const totalAmount = parseFloat(formData.amount_to_be_paid) || 0;
    const paidAmount = paymentEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    return Math.max(0, totalAmount - paidAmount);
  };

  const executeSubmit = async (historyData = []) => {
    if (!formData.patient_uhid || !formData.patient_ip_number || !formData.patient_name || !formData.date_of_admission) {
      toast.error("Please fill required fields (Patient UHID, Patient IP Number, Patient Name, Date of Admission).");
      return;
    }

    setLoading(true);

    try {
      const validPayments = paymentEntries
        .filter((entry) => entry.amount && entry.payment_method && entry.date)
        .map((entry) => ({
          amount: parseFloat(entry.amount),
          payment_method: entry.payment_method,
          upi_details: entry.payment_method === "UPI" ? entry.upi_details : "",
          date: entry.date,
        }));

      const totalAmount = parseFloat(formData.amount_to_be_paid) || 0;
      const totalPaid = validPayments.reduce((sum, p) => sum + p.amount, 0);

      if (totalPaid > totalAmount) {
        toast.error(`Total payments (₹${totalPaid}) cannot exceed expected amount (₹${totalAmount}).`);
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        date: editData?.date || getTodayDate(),
        payment_details: validPayments,
      };

      const isUpdate = editData?.rt_id || editData?.id;
      if (isUpdate) {
        payload.id = editData.rt_id || editData.id;
        payload.editHistory = historyData;
      }

      const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;
      let url = `${Insurancebaseurl}rt_records/`;
      let method = "POST";
      
      if (isUpdate) {
        url = `${Insurancebaseurl}rtrecords/${editData.rt_id || editData.id}/`;
        method = "PUT";
      }
      
      const response = await apiRequest(url, method, payload);
      
      if (response.success || response.status === 200 || response.status === 201) {
        toast.success(`RT Record ${method === "PUT" ? "updated" : "submitted"} successfully!`);
        if (method === "PUT") {
          setTimeout(() => navigate(-1), 1500);
        } else {
          setFormData({
            patient_uhid: "",
            patient_ip_number: "",
            patient_name: "",
            date_of_admission: "",
            date_of_discharge: "",
            insurance_type: "",
            amount_to_be_paid: "",
          });
          setPaymentEntries([{ id: Date.now(), amount: "", payment_method: "", upi_details: "", date: "" }]);
        }
      } else {
        toast.error("Failed to submit form.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient_uhid) { toast.error("Patient UHID is required"); return; }
    if (!formData.patient_ip_number) { toast.error("Patient IP Number is required"); return; }
    if (!formData.patient_name) { toast.error("Patient Name is required"); return; }
    if (!formData.date_of_admission) { toast.error("Date of Admission is required"); return; }
    if (!formData.date_of_discharge) { toast.error("Date of Discharge is required"); return; }
    if (!formData.insurance_type) { toast.error("Insurance Type is required"); return; }
    if (!formData.amount_to_be_paid) { toast.error("Amount to be Paid is required"); return; }

    const isUpdate = editData?.rt_id || editData?.id;
    if (isUpdate) {
      const validPayments = paymentEntries
        .filter((entry) => entry.amount && entry.payment_method && entry.date)
        .map((entry) => ({
          amount: parseFloat(entry.amount),
          payment_method: entry.payment_method,
          upi_details: entry.payment_method === "UPI" ? entry.upi_details : "",
          date: entry.date,
        }));

      const payload = {
        ...formData,
        date: editData?.date || getTodayDate(),
        payment_details: validPayments,
      };

      const changes = getChangedFields(editData, payload);
      if (changes.length > 0) {
        setShowEditModal(true);
        return;
      }
    }
    await executeSubmit(editData ? (editData.editHistory || []) : []);
  };

  const handleModalConfirm = async (reason) => {
    setShowEditModal(false);
    const validPayments = paymentEntries
      .filter((entry) => entry.amount && entry.payment_method && entry.date)
      .map((entry) => ({
        amount: parseFloat(entry.amount),
        payment_method: entry.payment_method,
        upi_details: entry.payment_method === "UPI" ? entry.upi_details : "",
        date: entry.date,
      }));

    const payload = {
      ...formData,
      date: editData?.date || getTodayDate(),
      payment_details: validPayments,
    };

    const changes = getChangedFields(editData, payload);
    const newHistoryItem = {
      edited_by: localStorage.getItem("employeeId") || localStorage.getItem("name") || "system",
      edited_date: new Date().toISOString(),
      edited_reason: reason,
      changes: changes
    };
    const updatedHistory = [...((editData && editData.editHistory) || []), newHistoryItem];
    await executeSubmit(updatedHistory);
  };

  return (
    <FormContainer>
      
      <Title>{(editData?.rt_id || editData?.id) ? "Edit RT Record" : "RT Record Form"}</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Patient Details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <Label>Date</Label>
              <Input type="date" value={formatDateStr(editData?.date) || getTodayDate()} disabled style={{ backgroundColor: "#f8f9fa" }} />
            </div>
            <div>
              <Label>Patient UHID <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="text"
                name="patient_uhid"
                value={formData.patient_uhid}
                onChange={handleChange}
                placeholder="Enter Patient UHID"
                required
              />
            </div>
            <div>
              <Label>Patient IP Number <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="text"
                name="patient_ip_number"
                value={formData.patient_ip_number}
                onChange={handleChange}
                placeholder="Enter Patient IP Number"
                required
              />
            </div>
            <div>
              <Label>Patient Name <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div>
              <Label>Date of Admission <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="date"
                name="date_of_admission"
                value={formData.date_of_admission}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Date of Discharge <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="date"
                name="date_of_discharge"
                value={formData.date_of_discharge}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection>
          <SectionTitle>Insurance & Billing</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <Label>Insurance Type <span style={{ color: "red" }}>*</span></Label>
              <Select name="insurance_type" value={formData.insurance_type} onChange={handleChange} required>
                <option value="">Select Insurance Type</option>
                <option value="General Insurance">General Insurance</option>
                <option value="ECHS">ECHS</option>
                <option value="ESI">ESI</option>
                <option value="ESIC">ESIC</option>
                <option value="Railway CTSE">Railway CTSE</option>
                <option value="Pay Patient">Pay Patient</option>
              </Select>
            </div>
            {formData.insurance_type === "General Insurance" && (
              <div>
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
              </div>
            )}
            <div>
              <Label>Amount to be Paid <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="number"
                name="amount_to_be_paid"
                value={formData.amount_to_be_paid}
                onChange={handleChange}
                placeholder="Enter total amount"
                min="0"
                required
                disabled={!!(editData?.rt_id || editData?.id)}
              />
            </div>
          </div>
        </FormSection>

        <FormSection>
          <SectionTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Payment Details</span>
            <span style={{ fontSize: "16px", color: "#28a745" }}>
              Remaining Amount: {calculateRemainingAmount()}
            </span>
            <Button
              type="button"
              onClick={addPaymentEntry}
              style={{ padding: "5px 15px", width: "auto" }}
            >
              + Add Payment
            </Button>
          </SectionTitle>

          <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
            {paymentEntries.map((entry, index) => (
              <div key={entry.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "15px", marginBottom: "15px", alignItems: "end" }}>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={entry.amount}
                    onChange={(e) => handlePaymentEntryChange(entry.id, "amount", e.target.value)}
                    placeholder="Amount"
                    disabled={entry.isExisting}
                  />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={entry.payment_method}
                    onChange={(e) => handlePaymentEntryChange(entry.id, "payment_method", e.target.value)}
                    required={!!entry.amount}
                    disabled={entry.isExisting}
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </Select>
                </div>
                {entry.payment_method === "UPI" && (
                  <div>
                    <Label>UPI Details</Label>
                    <Input
                      type="text"
                      value={entry.upi_details || ""}
                      onChange={(e) => handlePaymentEntryChange(entry.id, "upi_details", e.target.value)}
                      placeholder="UPI Transaction ID"
                      disabled={entry.isExisting}
                      required
                    />
                  </div>
                )}
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handlePaymentEntryChange(entry.id, "date", e.target.value)}
                    max={getTodayDate()}
                    required={!!entry.amount}
                    disabled={entry.isExisting}
                  />
                </div>
                {!entry.isExisting && paymentEntries.length > 1 && (
                  <Button type="button" onClick={() => removePaymentEntry(entry.id)} style={{ backgroundColor: "#dc3545", width: "auto" }}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </FormSection>

        <ButtonWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : (editData?.rt_id || editData?.id) ? "Update Record" : "Submit"}
          </Button>
          {(editData?.rt_id || editData?.id) && (
            <Button type="button" onClick={() => navigate(-1)} style={{ marginLeft: "10px", background: "#666" }}>
              Cancel
            </Button>
          )}
        </ButtonWrapper>
      </Form>

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
    </FormContainer>
  );
};

export default RTForm;
