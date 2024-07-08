import { useState, createContext, useContext, ReactNode, FC } from 'react';
import Modal from './Modal';

interface DialogModalContextProps {
    isOpen: boolean;
    close: () => void;
}

const DialogModalContext = createContext<DialogModalContextProps | undefined>(undefined);

interface DialogModalProps {
    show?: boolean;
    maxWidth?: string;
    closeable?: boolean;
    onClose?: () => void;
    children: ReactNode;
}

const DialogModal: FC<DialogModalProps> & {
    Title: FC<{ children: ReactNode }>;
    Content: FC<{ children: ReactNode }>;
    Footer: FC<{ children: ReactNode }>;
} = ({ show = false, maxWidth = '2xl', closeable = true, onClose, children }) => {
    const [isOpen, setIsOpen] = useState(show);

    const close = () => {
        if (onClose) {
            onClose();
        }
        setIsOpen(false);
    };

    return (
        <DialogModalContext.Provider value={{ isOpen, close }}>
            <Modal show={isOpen} maxWidth={maxWidth} closeable={closeable} onClose={close}>
                {children}
            </Modal>
        </DialogModalContext.Provider>
    );
};

const Title: FC<{ children: ReactNode }> = ({ children }) => {
    const context = useContext(DialogModalContext);
    if (!context) {
        throw new Error('Title must be used within a DialogModal');
    }

    const { isOpen } = context;

    return isOpen ? <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{children}</div> : null;
};

const Content: FC<{ children: ReactNode }> = ({ children }) => {
    const context = useContext(DialogModalContext);
    if (!context) {
        throw new Error('Content must be used within a DialogModal');
    }

    const { isOpen } = context;

    return isOpen ? <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">{children}</div> : null;
};

const Footer: FC<{ children: ReactNode }> = ({ children }) => {
    const context = useContext(DialogModalContext);
    if (!context) {
        throw new Error('Footer must be used within a DialogModal');
    }

    const { isOpen } = context;

    return isOpen ? (
        <div className="mt-4 flex flex-row justify-end bg-gray-100 text-end dark:bg-gray-800">{children}</div>
    ) : null;
};

DialogModal.Title = Title;
DialogModal.Content = Content;
DialogModal.Footer = Footer;

export default DialogModal;
