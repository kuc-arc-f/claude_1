import React, { useState } from 'react';

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { z } from 'zod';

type TodoFormData = {
  title: string;
};

type TodoFormProps = {
  handleSubmit: (data: TodoFormData) => void;
  currentTodo?: any,
  formData?: any;
  setFormData: any;
  isOpen: boolean;
  setIsOpen: any;
  resetForm: any;
  errors: any;
  ErrorMessage: any;
};

const TodoForm: React.FC<TodoFormProps> = ({ 
  handleSubmit, currentTodo, formData, setFormData, onClose, isOpen , 
  setIsOpen , resetForm, errors, ErrorMessage
  }) => {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="mr-2 h-4 w-4" /> 新規作成
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentTodo ? '編集' : '新規作成'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">タイトル</Label>
            <div className="col-span-3">
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? "border-red-500" : ""}
              />
              <ErrorMessage fieldName="title" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">内容</Label>
            <div className="col-span-3">
              <Textarea
                name="content"
                rows={14}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className={errors.content ? 'border-red-500' : ''}
                />              
              <ErrorMessage fieldName="content" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>
            {currentTodo ? '更新' : '作成'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
