import React from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import TodoForm, { TodoFormData } from './TodoForm';

type TodoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  todo: TodoFormData;
  onSave: (data: TodoFormData) => void;
};

const TodoDialog: React.FC<TodoDialogProps> = ({ isOpen, onClose, todo, onSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit TODO</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TodoForm onSubmit={onSave} defaultValues={todo} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TodoDialog;
