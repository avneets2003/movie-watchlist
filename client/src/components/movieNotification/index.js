import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import '../../globalStyles.css';

const MovieNotification = ({ message, showToast, setShowToast }) => {
    return (
        <ToastContainer className="p-3 movie-toast-container">
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="movie-toast">
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default MovieNotification;
