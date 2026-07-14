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

const ChemoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state;

  const [formData, setFormData] = useState({
    patient_name: editData?.patient_name || "",
    date_of_admission: formatDateStr(editData?.date_of_admission),
    date_of_discharge: formatDateStr(editData?.date_of_discharge),
    insurance_type: editData?.insurance_type || "",
    specificInsuranceCompany: editData?.specificInsuranceCompany || "",
    amount_to_be_paid: editData?.amount_to_be_paid || "",
    medicine_details: editData?.medicine_details || "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_name || !formData.date_of_admission) {
      toast.error("Please fill required fields (Patient Name, Date of Admission).");
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

      if (editData?.chemo_id || editData?.id) {
        payload.id = editData.chemo_id || editData.id;
      }

      const Insurancebaseurl = process.env.REACT_APP_BACKEND_INSURANCE_BASE_URL;
      let url = `${Insurancebaseurl}chemo_records/`;
      let method = "POST";
      
      if (editData?.chemo_id || editData?.id) {
        url = `${Insurancebaseurl}chemorecords/${editData.chemo_id || editData.id}/`;
        method = "PUT";
      }
      
      const response = await apiRequest(url, method, payload);
      
      if (response.success || response.status === 200 || response.status === 201) {
        toast.success(`Chemo Record ${method === "PUT" ? "updated" : "submitted"} successfully!`);
        if (method === "PUT") {
          setTimeout(() => navigate(-1), 1500);
        } else {
          setFormData({
            patient_name: "",
            date_of_admission: "",
            date_of_discharge: "",
            insurance_type: "",
            amount_to_be_paid: "",
            medicine_details: "",
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

  return (
    <FormContainer>
      <Toaster position="top-right" />
      <Title>{(editData?.chemo_id || editData?.id) ? "Edit Chemo Record" : "Chemotherapy (Chemo) Form"}</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Patient Details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <Label>Date</Label>
              <Input type="date" value={formatDateStr(editData?.date) || getTodayDate()} disabled style={{ backgroundColor: "#f8f9fa" }} />
            </div>
            <div>
              <Label>Patient Name *</Label>
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
              <Label>Date of Admission *</Label>
              <Input
                type="date"
                name="date_of_admission"
                value={formData.date_of_admission}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Date of Discharge</Label>
              <Input
                type="date"
                name="date_of_discharge"
                value={formData.date_of_discharge}
                onChange={handleChange}
              />
            </div>
          </div>
        </FormSection>

        <FormSection>
          <SectionTitle>Insurance & Medical Details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <Label>Insurance Type</Label>
              <Select name="insurance_type" value={formData.insurance_type} onChange={handleChange}>
                <option value="">Select Insurance Type</option>
                <option value="General Insurance">General Insurance</option>
                <option value="ECHS">ECHS</option>
                <option value="ESI">ESI</option>
                <option value="ESIC">ESIC</option>
                <option value="Railway CTSE">Railway CTSE</option>
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
              <Label>Amount to be Paid</Label>
              <Input
                type="number"
                name="amount_to_be_paid"
                value={formData.amount_to_be_paid}
                onChange={handleChange}
                placeholder="Enter total amount"
                min="0"
                disabled={!!(editData?.chemo_id || editData?.id)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>Medicine Details</Label>
              <textarea
                name="medicine_details"
                value={formData.medicine_details}
                onChange={handleChange}
                placeholder="Enter medicine details"
                style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
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
            {loading ? "Saving..." : (editData?.chemo_id || editData?.id) ? "Update Record" : "Submit"}
          </Button>
          {(editData?.chemo_id || editData?.id) && (
            <Button type="button" onClick={() => navigate(-1)} style={{ marginLeft: "10px", background: "#666" }}>
              Cancel
            </Button>
          )}
        </ButtonWrapper>
      </Form>
    </FormContainer>
  );
};

export default ChemoForm;
