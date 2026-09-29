import { useEffect, useState, FormEvent } from "react";
import axios from "axios";

import { submitRequest } from "../../services/requestApi";

import SearchableDropdown from "./SearchableDropdown";

import "./FileDeptHeadRequestModal.css";

interface FileDeptHeadRequestModalProps {
    show: boolean;
    onClose: () => void;
    onFiled: () => void;
}

// TODO: fetch these from the backend (student IDs enrolled in this
// department head's department) and populate accordingly. Left empty for
// now — the dropdown UI/behavior can still be reviewed, it'll just have
// nothing to show until then.
const STUDENT_OPTIONS: string[] = [];

function FileDeptHeadRequestModal({ show, onClose, onFiled }: FileDeptHeadRequestModalProps) {

    const [details, setDetails] = useState("");
    const [message, setMessage] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [hasFiled, setHasFiled] = useState(false);

    useEffect(() => {
        if (!show) return;

        setDetails("");
        setMessage("");
        setSubmitError("");
        setHasFiled(false);
    }, [show]);

    if (!show) return null;

    const canSubmit =
        details.trim() !== "" &&
        message.trim() !== "" &&
        !submitting;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!canSubmit) {
            setSubmitError("Please fill in both fields before submitting.");
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError("");

            await submitRequest({
                type: "By Student",
                details: details.trim(),
                message: message.trim(),
            });

            setHasFiled(true);
        } catch (err) {
            console.error("Failed to submit request:", err);

            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message;

                if (typeof backendMessage === "string" && backendMessage.trim() !== "") {
                    setSubmitError(backendMessage);
                } else {
                    setSubmitError("Failed to submit request. Please try again.");
                }
            } else {
                setSubmitError("Failed to submit request. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="file-request-overlay">
            <div className="file-request-modal" onClick={(e) => e.stopPropagation()}>

                <div className="file-request-modal-header">
                    <div className="file-request-header-left">
                        <div className={`file-request-header-icon ${hasFiled ? "success" : ""}`}>
                            <i className={`bi ${hasFiled ? "bi-check-lg" : "bi-inbox"}`}></i>
                        </div>
                        <h5>{hasFiled ? "Request Submitted" : "File a New Request"}</h5>
                    </div>
                    <button
                        type="button"
                        className="file-request-close-btn"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {hasFiled ? (
                    <div className="file-request-modal-body">

                        <div className="file-request-success-icon">
                            <i className="bi bi-check-lg"></i>
                        </div>

                        <p className="new-request-hint mb-4">
                            Your request has been filed and is now waiting for the Prefect's approval.
                        </p>

                        <p className="new-request-hint mb-0">
                            You'll be able to track its status from your Requests page.
                        </p>

                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="file-request-form">

                        <div className="file-request-modal-body">

                            <div className="file-request-section">
                                <div className="file-request-section-title">
                                    <span className="file-request-step-num">1</span>
                                    Student ID <span className="required-asterisk">*</span>
                                </div>
                                <p className="new-request-hint mb-2">
                                    Requests may only be filed for a single, specific student.
                                </p>
                                <SearchableDropdown
                                    id="requestDetails"
                                    value={details}
                                    onChange={setDetails}
                                    options={STUDENT_OPTIONS}
                                    placeholder="e.g. JHS-0046"
                                    disabled={submitting}
                                    emptyLabel="No matching student found"
                                />
                            </div>

                            <div className="file-request-section">
                                <div className="file-request-section-title">
                                    <span className="file-request-step-num">2</span>
                                    Reason for Request <span className="required-asterisk">*</span>
                                </div>
                                <p className="new-request-hint mb-2">
                                    Explain why you're requesting these disciplinary records.
                                </p>
                                <textarea
                                    id="requestMessage"
                                    className="form-control new-request-textarea"
                                    rows={4}
                                    placeholder="Type your request here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={500}
                                    disabled={submitting}
                                />
                            </div>

                            {submitError && <p className="text-danger">{submitError}</p>}

                        </div>

                        <div className="file-request-modal-footer">
                            <button
                                type="button"
                                className="file-request-cancel-btn"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="submit-request-btn" disabled={!canSubmit}>
                                {submitting ? "Checking records..." : "Submit Request"}
                            </button>
                        </div>

                    </form>
                )}

                {hasFiled && (
                    <div className="file-request-modal-footer">
                        <button
                            type="button"
                            className="submit-request-btn"
                            onClick={onFiled}
                        >
                            View My Requests
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default FileDeptHeadRequestModal;
