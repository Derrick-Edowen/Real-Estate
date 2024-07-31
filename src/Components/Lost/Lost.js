import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Lost() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate('/Home');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, [navigate]);

    return (
        <div style={styles.container}>
            <div style={styles.sadFace}>:(</div>
            <div style={styles.errorText}>404 Error - Page Not Found!</div>
            <div style={styles.message}>Rerouting you to the Home page!  In {countdown} Seconds...</div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        textAlign: 'center',
        fontFamily: 'Open Sans", Arial, Helvetica Neue, Helvetica, sans-serif',
    },
    sadFace: {
        fontSize: '100px',
        marginBottom: '20px',
    },
    errorText: {
        fontSize: '30px',
        marginBottom: '10px',
    },
    message: {
        fontSize: '20px',
    },
};

export default Lost;