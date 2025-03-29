'use client';

import { ReactNode } from 'react';
import Modal from 'react-modal';
import styles from './ModalComponent.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  key?: string;
}

export default function ModalComponent({
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (typeof window !== 'undefined') {
    Modal.setAppElement('#__next');
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      {children}
    </Modal>
  );
}
