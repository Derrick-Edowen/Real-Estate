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

    return (<>

        <div style={styles.container}>
        <img src='https://storage.googleapis.com/realestate-images/luxliving.jpg' className='splasherMiss' alt='Home Background' />
            <div style={styles.sadFace}>:(</div>
            <div style={styles.errorText}>404 Error - Page Not Found!</div>
            <div style={styles.message}>Redirecting you in {countdown} seconds...</div>
        </div>
    </>);
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '76vh',
        textAlign: 'center',
        fontFamily: 'Open Sans", Arial, Helvetica Neue, Helvetica, sans-serif',
        color: 'white',
        textShadow: '2px 2px 1px black'
    },
    sadFace: {
        fontSize: '180px',
        marginBottom: '20px',
    },
    errorText: {
        fontSize: '56px',
        marginBottom: '10px',
    },
    message: {
        fontSize: '48px',
    },
};

export default Lost;