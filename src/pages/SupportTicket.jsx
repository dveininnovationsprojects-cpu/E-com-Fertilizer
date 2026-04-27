import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const SupportTicket = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const theme = {
        primary: "#9cc43c",
        primaryHover: "#8ab035",
        bg: "#f9fbf9",
        text: "#333333",
        subText: "#666666",
        border: "#eaeaec",
        white: "#ffffff",
        danger: "#e74c3c",
        success: "#2ecc71",
        cardShadow: "0 10px 30px rgba(0, 0, 0, 0.05)"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg({ type: '', text: '' });

        try {
            // Using your protected route /api/support
            const res = await API.post('/support', { subject, message });
            
            if (res.data || res.status === 201) {
                setStatusMsg({ type: 'success', text: 'Support ticket submitted successfully! We will contact you soon.' });
                setSubject('');
                setMessage('');
                
                // Automatically redirect back to home after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            setStatusMsg({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to submit ticket. Please ensure you are logged in.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '80vh',
            backgroundColor: theme.bg,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        },
        card: {
            backgroundColor: theme.white,
            padding: '40px',
            borderRadius: '16px',
            boxShadow: theme.cardShadow,
            width: '100%',
            maxWidth: '500px',
            boxSizing: 'border-box'
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px'
        },
        title: {
            fontSize: '24px',
            fontWeight: '700',
            color: theme.primary,
            margin: '0 0 10px 0'
        },
        subtitle: {
            fontSize: '15px',
            color: theme.subText,
            margin: 0,
            lineHeight: '1.5'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '8px'
        },
        input: {
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s ease',
            backgroundColor: '#fafafa',
            color: theme.text
        },
        textarea: {
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s ease',
            minHeight: '150px',
            resize: 'vertical',
            backgroundColor: '#fafafa',
            color: theme.text,
            fontFamily: 'inherit'
        },
        submitBtn: {
            width: '100%',
            padding: '16px',
            backgroundColor: theme.primary,
            color: theme.white,
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginTop: '10px'
        },
        messageBox: {
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: '1.5'
        },
        backLink: {
            display: 'block',
            textAlign: 'center',
            marginTop: '25px',
            color: theme.subText,
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'color 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                <div style={styles.header}>
                    <h1 style={styles.title}>Contact Support</h1>
                    <p style={styles.subtitle}>Need help with your order or products? Send us a message and we'll get back to you via email.</p>
                </div>

                {statusMsg.text && (
                    <div style={{
                        ...styles.messageBox, 
                        backgroundColor: statusMsg.type === 'success' ? '#eefaf3' : '#fdeaea',
                        color: statusMsg.type === 'success' ? theme.success : theme.danger,
                        border: `1px solid ${statusMsg.type === 'success' ? '#c3e6cb' : '#fadbd8'}`
                    }}>
                        {statusMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Subject</label>
                        <input 
                            type="text" 
                            style={styles.input}
                            placeholder="Briefly describe your issue..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Message Details</label>
                        <textarea 
                            style={styles.textarea}
                            placeholder="Provide any relevant order numbers or specific details here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        style={{
                            ...styles.submitBtn,
                            backgroundColor: loading ? '#b5d56a' : theme.primary,
                            cursor: loading ? 'wait' : 'pointer'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Sending Message...' : 'Submit Ticket'}
                    </button>
                </form>

                <div 
                    style={styles.backLink}
                    onClick={() => navigate('/')}
                    onMouseOver={(e) => e.target.style.color = theme.primary}
                    onMouseOut={(e) => e.target.style.color = theme.subText}
                >
                    &larr; Back to Home
                </div>

            </div>
        </div>
    );
};

export default SupportTicket;