import React, { useState } from 'react';


//import { Button, Dialog, DialogContent, Input, Label } from '@shadcn/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TodoFormData = {
  title: string;
};

type TodoFormProps = {
  onSubmit: (data: TodoFormData) => void;
  defaultValues?: TodoFormData;
  onClose: () => void;
  isOpen: boolean;
};

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, defaultValues, onClose, isOpen }) => {
  const [formData, setFormData] = useState<TodoFormData>(
    defaultValues || { title: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Label>Title</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title"
            required
          />
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
