
import Head from '../components/Head'

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
//
import Head from '../components/Head';
import CrudIndex from './Mermaid/CrudIndex';


//
const items = [
  {id: 1, title: "about", url: "/about"},
  {id: 2, title: "chat", url: "/chat"},
  {id: 3, title: "cms", url: "/cms"},
  {id: 4, title: "form_test1", url: "/form_test1"},
  {id: 5, title: "form_test3", url: "/form_test3"},
  {id: 6, title: "Form4", url: "/form_test4"},
  {id: 7, title: "Form5", url: "/form_test5"},
  {id: 8, title: "Form6", url: "/form_test6"},
  {id: 9, title: "plan", url: "/plan"},
  {id: 10, title: "plan4", url: "/plan4"},
  {id: 11, title: "Mermaid", url: "/mermaid"},
  {id: 12, title: "todo", url: "/todo"},
  {id: 13, title: "TaskProject", url: "/task_project"},
];

const TodoApp: React.FC = () => {

  return (
  <>
    <Head />
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">About</h1>
      </div>


    </div>  
  </>

  );
};

export default TodoApp;
