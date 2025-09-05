import React from 'react';
import { Container, Form, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

function AddAccount({ onSubmit }) {
  const { loadingAddBankAccount } = useSelector((state) => state.withdrawal);

  const bankFormik = useFormik({
    initialValues: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      upiId: ''
    },
    validationSchema: Yup.object().shape({
      accountName: Yup.string().required("Account name is required"),
      accountNumber: Yup.string().required("Account number is required"),
      bankName: Yup.string().required("Bank Name is required"),
      ifscCode: Yup.string()
        .required("IFSC code is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
      upiId: Yup.string()
        .required("UPI ID is required")
        .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, "Invalid UPI ID"),
    }),
    onSubmit: (values) => {
      onSubmit(values); // ✅ correctly calling the passed prop
    },
  });

  return (
    <Container>
      <Form onSubmit={bankFormik.handleSubmit}>
        <div className="mb-2">
          <label htmlFor="accountName" className="form-label">Account holder Name</label>
          <input
            id="accountName"
            name="accountName"
            placeholder="Enter account holder name"
            type="text"
            className={`form-control ${bankFormik.touched.accountName && bankFormik.errors.accountName ? 'is-invalid' : ''}`}
            onChange={bankFormik.handleChange}
            onBlur={bankFormik.handleBlur}
            value={bankFormik.values.accountName}
          />
          {bankFormik.touched.accountName && bankFormik.errors.accountName && (
            <div className="invalid-feedback">{bankFormik.errors.accountName}</div>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="accountNumber" className="form-label">Account Number</label>
          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            placeholder="Enter account number"
            className={`form-control ${bankFormik.touched.accountNumber && bankFormik.errors.accountNumber ? 'is-invalid' : ''}`}
            onChange={bankFormik.handleChange}
            onBlur={bankFormik.handleBlur}
            value={bankFormik.values.accountNumber}
          />
          {bankFormik.touched.accountNumber && bankFormik.errors.accountNumber && (
            <div className="invalid-feedback">{bankFormik.errors.accountNumber}</div>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="bankName" className="form-label">Bank Name</label>
          <input
            id="bankName"
            name="bankName"
            placeholder="Enter bank name"
            type="text"
            className={`form-control ${bankFormik.touched.bankName && bankFormik.errors.bankName ? 'is-invalid' : ''}`}
            onChange={bankFormik.handleChange}
            onBlur={bankFormik.handleBlur}
            value={bankFormik.values.bankName}
          />
          {bankFormik.touched.bankName && bankFormik.errors.bankName && (
            <div className="invalid-feedback">{bankFormik.errors.bankName}</div>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
          <input
            id="ifscCode"
            name="ifscCode"
            placeholder="Enter IFSC code"
            type="text"
            className={`form-control ${bankFormik.touched.ifscCode && bankFormik.errors.ifscCode ? 'is-invalid' : ''}`}
            onChange={(e) => bankFormik.setFieldValue('ifscCode', e.target.value.toUpperCase())}
            onBlur={bankFormik.handleBlur}
            value={bankFormik.values.ifscCode}
          />
          {bankFormik.touched.ifscCode && bankFormik.errors.ifscCode && (
            <div className="invalid-feedback">{bankFormik.errors.ifscCode}</div>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="upiId" className="form-label">UPI ID</label>
          <input
            id="upiId"
            name="upiId"
            type="text"
            placeholder="Enter UPI ID"
            className={`form-control ${bankFormik.touched.upiId && bankFormik.errors.upiId ? 'is-invalid' : ''}`}
            onChange={bankFormik.handleChange}
            onBlur={bankFormik.handleBlur}
            value={bankFormik.values.upiId}
          />
          {bankFormik.touched.upiId && bankFormik.errors.upiId && (
            <div className="invalid-feedback">{bankFormik.errors.upiId}</div>
          )}
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="mt-2 btn bg-blue w-100 text-white"
            disabled={loadingAddBankAccount}
          >
            {loadingAddBankAccount ? <Spinner size="sm" /> : 'Add Bank Account'}
          </button>
        </div>
      </Form>
    </Container>
  );
}

export default AddAccount;
