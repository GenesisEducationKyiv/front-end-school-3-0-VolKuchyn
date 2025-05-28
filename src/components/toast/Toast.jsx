import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '../../redux/toast-reducer';
import './Toast.css';

const Toast = () => {
    const dispatch = useDispatch();
    const { message, type } = useSelector((state) => state.toast);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);

                setTimeout(() => {
                    dispatch(clearToast());
                }, 300);
            }, 1500);
        }
    }, [message]);

    if (!message) return null;

    return (
        <div className={`toast ${type} ${!visible ? 'fade-out' : ''}`} data-testid="toast-container">
            <div data-testid={`toast-${type}`}>{message}</div>
        </div>
    );
};

export default Toast;