// App.js
import React, { useState, useEffect } from 'react';
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

function App() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTodo, setCurrentTodo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialFormState = {
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

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "エラー",
        description: "タイトルは必須です",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentTodo) {
      // 編集モード
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
      // 新規作成モード
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

  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setFormData(todo);
    onOpen();
  };

  const handleDelete = (id) => {
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
                      onClick={() => handleDelete(todo.id)}
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
              <FormControl>
                <FormLabel>タイトル</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>内容</FormLabel>
                <Input
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>公開設定</FormLabel>
                <RadioGroup name="public" value={formData.public}>
                  <Stack direction="row">
                    <Radio 
                      value="public"
                      onChange={handleInputChange}
                      name="public"
                    >
                      公開
                    </Radio>
                    <Radio 
                      value="private"
                      onChange={handleInputChange}
                      name="public"
                    >
                      非公開
                    </Radio>
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

              <FormControl>
                <FormLabel>数量1</FormLabel>
                <Input
                  type="text"
                  name="qty1"
                  value={formData.qty1}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>数量2</FormLabel>
                <Input
                  type="text"
                  name="qty2"
                  value={formData.qty2}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>数量3</FormLabel>
                <Input
                  type="text"
                  name="qty3"
                  value={formData.qty3}
                  onChange={handleInputChange}
                />
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
