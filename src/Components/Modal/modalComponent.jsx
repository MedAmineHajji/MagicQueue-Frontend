import { useEffect, useContext, createContext } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import './modalComponent.css'
import { Modal } from '@mui/material';



const ModalContext = createContext();

function ModalComponent({ children, isOpen, onClose }){

    const modalTransition = useTransition(isOpen, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 1},
        config: {
            duration: 300
        }
    })
    const springs = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0%)" : "translateY(-100%)",
        config: {
            duration: 300
        }
    })

    const handleEscape = e => {
        if(e.keyCode == 27){
            onClose();
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEscape);

        return () => document.removeEventListener("keydown", handleEscape)
    }, [])


    return modalTransition((styles, isOpen) => isOpen && (
        <animated.div style={styles} className="react-modal-overlay" onClick={onClose}>
            <animated.div style={springs} className="react-modal-wrapper" onClick={e => e.stopPropagation()}>
                <div className="react-modal-content">
                
                    <ModalContext.Provider value={{ onClose }}>
                        {children}
                    </ModalContext.Provider>
                    
                </div>
            </animated.div>
        </animated.div>
    ))
    
}

const DismissButton = ({ children, className }) => {
    const { onClose } = useContext(ModalContext);

    return(
        <button type='button' className={className} onClick={onClose}>
            {children}
        </button>
    )
}

const ModalHeader = ({ children }) => {
    
    

    return(
        <div className="react-modal-header">
            <div className="react-modal-title">{children}</div>

            <DismissButton className='btn-close'>&times;</DismissButton>
        </div>
    )
}

const ModalBody = ({ children }) => {


    return(
        <div className="react-modal-body">
            {children}
        </div>
    )
}

const ModalFooter = ({ children }) => {


    return(
        <div className="react-modal-footer">
            {children}
        </div>
    )
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.DismissButton = DismissButton;

export default ModalComponent;