// types.ts
import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
});

export type TodoType = z.infer<typeof TodoSchema>;

// App.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  VStack,
  HStack,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
//import { TodoSchema, TodoType } from './types';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTodo, setCurrentTodo] = useState<TodoType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialFormState: TodoType = {
    title: '',
    content: '',
    public: 'public',
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: '',
    qty1: '',
    qty2: '',
    qty3: '',
  };

  const [formData, setFormData] = useState<TodoType>(initialFormState);

  const validateForm = (): boolean => {
    try {
      TodoSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "バリデーションエラー",
        description: "入力内容を確認してください",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentTodo) {
      setTodos(prev => prev.map(todo => 
        todo.id === currentTodo.id ? { ...formData, id: todo.id } : todo
      ));
      toast({
        title: "更新完了",
        description: "TODOが更新されました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setTodos(prev => [...prev, { ...formData, id: Date.now() }]);
      toast({
        title: "作成完了",
        description: "新しいTODOが作成されました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    
    handleClose();
  };

  const handleEdit = (todo: TodoType) => {
    setCurrentTodo(todo);
    setFormData(todo);
    setErrors({});
    onOpen();
  };

  const handleDelete = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "削除完了",
      description: "TODOが削除されました",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClose = () => {
    setCurrentTodo(null);
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={5}>
        <HStack w="100%" justifyContent="space-between">
          <Button colorScheme="blue" onClick={onOpen}>新規TODO作成</Button>
          <HStack>
            <Input
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
            />
          </HStack>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>タイトル</Th>
              <Th>内容</Th>
              <Th>公開設定</Th>
              <Th>日付</Th>
              <Th>アクション</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTodos.map(todo => (
              <Tr key={todo.id}>
                <Td>{todo.title}</Td>
                <Td>{todo.content}</Td>
                <Td>{todo.public}</Td>
                <Td>{todo.pub_date}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<EditIcon />}
                      onClick={() => handleEdit(todo)}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      onClick={() => todo.id && handleDelete(todo.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentTodo ? 'TODO編集' : '新規TODO作成'}
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>タイトル</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.content}>
                <FormLabel>内容</FormLabel>
                <Input
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.content}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>公開設定</FormLabel>
                <RadioGroup 
                  name="public" 
                  value={formData.public}
                  onChange={(value) => setFormData(prev => ({ ...prev, public: value as "public" | "private" }))}
                >
                  <Stack direction="row">
                    <Radio value="public">公開</Radio>
                    <Radio value="private">非公開</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>フルーツ選択</FormLabel>
                <Stack direction="row">
                  <Checkbox
                    name="food_orange"
                    isChecked={formData.food_orange}
                    onChange={handleInputChange}
                  >
                    オレンジ
                  </Checkbox>
                  <Checkbox
                    name="food_apple"
                    isChecked={formData.food_apple}
                    onChange={handleInputChange}
                  >
                    りんご
                  </Checkbox>
                  <Checkbox
                    name="food_banana"
                    isChecked={formData.food_banana}
                    onChange={handleInputChange}
                  >
                    バナナ
                  </Checkbox>
                </Stack>
              </FormControl>

              <FormControl>
                <FormLabel>日付</FormLabel>
                <Input
                  type="date"
                  name="pub_date"
                  value={formData.pub_date}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.qty1}>
                <FormLabel>数量1</FormLabel>
                <Input
                  name="qty1"
                  value={formData.qty1}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.qty1}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.qty2}>
                <FormLabel>数量2</FormLabel>
                <Input
                  name="qty2"
                  value={formData.qty2}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.qty2}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.qty3}>
                <FormLabel>数量3</FormLabel>
                <Input
                  name="qty3"
                  value={formData.qty3}
                  onChange={handleInputChange}
                />
                <FormErrorMessage>{errors.qty3}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {currentTodo ? '更新' : '作成'}
            </Button>
            <Button variant="ghost" onClick={handleClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default App;
