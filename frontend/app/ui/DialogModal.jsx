import { useState, createContext, useContext } from 'react';
import Modal from './Modal';

const DialogModalContext = createContext();

const DialogModal = ({ show = false, maxWidth = '2xl', closeable = true, onClose, children }) => {
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

const Title = ({ children }) => {
   const { isOpen } = useContext(DialogModalContext);

   return isOpen ? <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{children}</div> : null;
};

const Content = ({ children }) => {
   const { isOpen } = useContext(DialogModalContext);

   return isOpen ? <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">{children}</div> : null;
};

const Footer = ({ children }) => {
   const { isOpen } = useContext(DialogModalContext);

   return isOpen ? (
      <div className="flex flex-row justify-end mt-4 bg-gray-100 dark:bg-gray-800 text-end">{children}</div>
   ) : null;
};

DialogModal.Title = Title;
DialogModal.Content = Content;
DialogModal.Footer = Footer;

export default DialogModal;
