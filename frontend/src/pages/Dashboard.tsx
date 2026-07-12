import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  HStack,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiTrash2, FiPlus, FiLogOut } from 'react-icons/fi';
import api from '../services/api';

interface Endereco {
  id: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface EnderecoFormData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnderecoFormData>();

  const loadEnderecos = async () => {
    try {
      const response = await api.get('/Endereco');
      setEnderecos(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        toast({
          title: 'Erro ao carregar endereços.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    loadEnderecos();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleOpenModal = (endereco?: Endereco) => {
    if (endereco) {
      setEditingId(endereco.id);
      setValue('cep', endereco.cep);
      setValue('logradouro', endereco.logradouro);
      setValue('numero', endereco.numero);
      setValue('complemento', endereco.complemento);
      setValue('bairro', endereco.bairro);
      setValue('cidade', endereco.cidade);
      setValue('uf', endereco.uf);
    } else {
      setEditingId(null);
      reset();
    }
    onOpen();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/Endereco/${id}`);
      toast({
        title: 'Endereço excluído.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadEnderecos();
    } catch (error) {
      toast({
        title: 'Erro ao excluir.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (data: EnderecoFormData) => {
    try {
      if (editingId) {
        await api.put(`/Endereco/${editingId}`, data);
        toast({ title: 'Endereço atualizado.', status: 'success', duration: 3000 });
      } else {
        await api.post('/Endereco', data);
        toast({ title: 'Endereço criado.', status: 'success', duration: 3000 });
      }
      onClose();
      loadEnderecos();
    } catch (error) {
      toast({ title: 'Erro ao salvar endereço.', status: 'error', duration: 3000 });
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setValue('cep', cep);

    if (cep.length === 8) {
      try {
        const response = await api.get(`/Endereco/viacep/${cep}`);
        const data = response.data;
        setValue('logradouro', data.logradouro || '');
        setValue('bairro', data.bairro || '');
        setValue('cidade', data.localidade || '');
        setValue('uf', data.uf || '');
        
        toast({ title: 'CEP encontrado!', status: 'success', duration: 2000 });
        document.getElementById('numero')?.focus();
      } catch (error) {
        toast({ title: 'CEP não encontrado.', status: 'warning', duration: 3000 });
      }
    }
  };

  if (isLoading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center" bg="gray.50">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Flex maxW="6xl" mx="auto" justify="space-between" align="center" mb={8}>
        <Heading color="blue.700">Meus Endereços</Heading>
        <HStack>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
            Novo Endereço
          </Button>
          <Button leftIcon={<FiLogOut />} variant="outline" colorScheme="red" onClick={handleLogout}>
            Sair
          </Button>
        </HStack>
      </Flex>

      <Box maxW="6xl" mx="auto" bg="white" p={6} borderRadius="lg" boxShadow="sm">
        {enderecos.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={10}>
            Nenhum endereço cadastrado.
          </Text>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>CEP</Th>
                  <Th>Logradouro</Th>
                  <Th>Número</Th>
                  <Th>Cidade / UF</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {enderecos.map((end) => (
                  <Tr key={end.id}>
                    <Td>{end.cep}</Td>
                    <Td>{end.logradouro}</Td>
                    <Td>{end.numero}</Td>
                    <Td>{end.cidade} - {end.uf}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Editar"
                          icon={<FiEdit2 />}
                          size="sm"
                          colorScheme="yellow"
                          onClick={() => handleOpenModal(end)}
                        />
                        <IconButton
                          aria-label="Excluir"
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(end.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{editingId ? 'Editar Endereço' : 'Novo Endereço'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.cep}>
                <FormLabel>CEP</FormLabel>
                <Input
                  {...register('cep', { required: 'CEP é obrigatório', minLength: 8, maxLength: 8 })}
                  onChange={handleCepChange}
                  placeholder="Apenas números (8 dígitos)"
                  maxLength={8}
                />
                <FormErrorMessage>{errors.cep?.message}</FormErrorMessage>
              </FormControl>

              <HStack w="full">
                <FormControl isInvalid={!!errors.logradouro}>
                  <FormLabel>Logradouro</FormLabel>
                  <Input {...register('logradouro', { required: 'Obrigatório' })} />
                </FormControl>
                
                <FormControl isInvalid={!!errors.numero} w="30%">
                  <FormLabel>Número</FormLabel>
                  <Input id="numero" {...register('numero', { required: 'Obrigatório' })} />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Complemento</FormLabel>
                <Input {...register('complemento')} />
              </FormControl>

              <FormControl isInvalid={!!errors.bairro}>
                <FormLabel>Bairro</FormLabel>
                <Input {...register('bairro', { required: 'Obrigatório' })} />
              </FormControl>

              <HStack w="full">
                <FormControl isInvalid={!!errors.cidade}>
                  <FormLabel>Cidade</FormLabel>
                  <Input {...register('cidade', { required: 'Obrigatório' })} />
                </FormControl>

                <FormControl isInvalid={!!errors.uf} w="30%">
                  <FormLabel>UF</FormLabel>
                  <Input {...register('uf', { required: 'Obrigatório' })} />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
