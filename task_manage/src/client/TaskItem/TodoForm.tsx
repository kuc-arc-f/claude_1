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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentTodo ? 'Task Edit' : 'Task New'}
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
              <Input
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className={errors.content ? "border-red-500" : ""}
              />
              <ErrorMessage fieldName="content" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">ステータス</Label>
            <RadioGroup
              className="col-span-3"
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">未着手</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="working" id="working" />
                <Label htmlFor="working">作業中</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complete" id="complete" />
                <Label htmlFor="complete">完了</Label>
              </div>

            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">開始日</Label>
            <Input
              className="col-span-3"
              type="date"
              value={formData.task_start}
              onChange={(e) => setFormData({ ...formData, task_start: e.target.value })}
            />
            {errors.task_start && (
              <Alert variant="destructive" className="mt-2 col-span-4">
                <AlertDescription>{errors.task_start}</AlertDescription>
              </Alert>
            )}            
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">終了日</Label>
            <Input
              className="col-span-3"
              type="date"
              value={formData.task_end}
              onChange={(e) => setFormData({ ...formData, task_end: e.target.value })}
            />
            {errors.task_end && (
              <Alert variant="destructive" className="mt-2 col-span-4">
                <AlertDescription>{errors.task_end}</AlertDescription>
              </Alert>
            )}
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
