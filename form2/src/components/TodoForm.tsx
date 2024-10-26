import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';

type TodoFormData = {
  title: string;
  content: string;
  public: string;
  food_orange: boolean;
  food_apple: boolean;
  food_banana: boolean;
  pub_date: string;
  qty1: string;
  qty2: string;
  qty3: string;
};

type TodoFormProps = {
  onSubmit: (data: TodoFormData) => void;
  defaultValues?: TodoFormData;
};

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, defaultValues }) => {
  const [formData, setFormData] = useState<TodoFormData>(
    defaultValues || {
      title: '',
      content: '',
      public: 'private',
      food_orange: false,
      food_apple: false,
      food_banana: false,
      pub_date: '',
      qty1: '',
      qty2: '',
      qty3: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Content</FormLabel>
        <Textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Public</FormLabel>
        <RadioGroup name="public" onChange={(value) => setFormData({ ...formData, public: value })} value={formData.public}>
          <Stack direction="row">
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Food Preferences</FormLabel>
        <Checkbox
          name="food_orange"
          isChecked={formData.food_orange}
          onChange={handleCheckboxChange}
        >
          Orange
        </Checkbox>
        <Checkbox
          name="food_apple"
          isChecked={formData.food_apple}
          onChange={handleCheckboxChange}
        >
          Apple
        </Checkbox>
        <Checkbox
          name="food_banana"
          isChecked={formData.food_banana}
          onChange={handleCheckboxChange}
        >
          Banana
        </Checkbox>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Publish Date</FormLabel>
        <Input
          type="date"
          name="pub_date"
          value={formData.pub_date}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Quantity 1</FormLabel>
        <Input
          name="qty1"
          value={formData.qty1}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Quantity 2</FormLabel>
        <Input
          name="qty2"
          value={formData.qty2}
          onChange={handleChange}
          required
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Quantity 3</FormLabel>
        <Input
          name="qty3"
          value={formData.qty3}
          onChange={handleChange}
          required
        />
      </FormControl>

      <Button mt={4} colorScheme="blue" type="submit">
        Save
      </Button>
    </form>
  );
};

export default TodoForm;
