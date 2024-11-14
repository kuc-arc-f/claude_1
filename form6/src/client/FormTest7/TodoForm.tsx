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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentTodo ? 'TODO編集' : '新規TODO作成'}
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
            <Label className="text-right">公開設定</Label>
            <RadioGroup
              className="col-span-3"
              value={formData.public}
              onValueChange={(value) => setFormData({ ...formData, public: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">公開</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">非公開</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">フルーツ</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.food_orange}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, food_orange: checked as boolean })}
                />
                <Label>オレンジ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.food_apple}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, food_apple: checked as boolean })}
                />
                <Label>りんご</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.food_banana}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, food_banana: checked as boolean })}
                />
                <Label>バナナ</Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">公開日</Label>
            <Input
              className="col-span-3"
              type="date"
              value={formData.pub_date}
              onChange={(e) => setFormData({ ...formData, pub_date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">数量1</Label>
            <div className="col-span-3">
              <Input
                value={formData.qty1}
                onChange={(e) => setFormData({ ...formData, qty1: e.target.value })}
                className={errors.qty1 ? "border-red-500" : ""}
              />
              <ErrorMessage fieldName="qty1" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">数量2</Label>
            <div className="col-span-3">
              <Input
                value={formData.qty2}
                onChange={(e) => setFormData({ ...formData, qty2: e.target.value })}
                className={errors.qty2 ? "border-red-500" : ""}
              />
              <ErrorMessage fieldName="qty2" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">数量3</Label>
            <div className="col-span-3">
              <Input
                value={formData.qty3}
                onChange={(e) => setFormData({ ...formData, qty3: e.target.value })}
                className={errors.qty3 ? "border-red-500" : ""}
              />
              <ErrorMessage fieldName="qty3" />
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
