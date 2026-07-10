import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Link,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue('white', 'gray.800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/Auth/login', { usuario, senha });
        localStorage.setItem('token', response.data.token);
        toast({
          title: 'Login efetuado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      } else {
        await api.post('/Auth/register', { nome, usuario, senha });
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Você já pode fazer login.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsLogin(true);
        setSenha(''); // Limpar senha para o usuário digitar no login
      }
    } catch (error: any) {
      toast({
        title: isLogin ? 'Falha no login' : 'Erro no cadastro',
        description: error.response?.data || 'Verifique seus dados e tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box p={8} maxW="md" w="full" bg={bg} boxShadow="xl" borderRadius="lg">
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="lg" textAlign="center">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </Heading>

          {!isLogin && (
            <FormControl id="nome" isRequired>
              <FormLabel>Nome Completo</FormLabel>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </FormControl>
          )}

          <FormControl id="usuario" isRequired>
            <FormLabel>Usuário</FormLabel>
            <Input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ex: joao123"
            />
          </FormControl>

          <FormControl id="senha" isRequired>
            <FormLabel>Senha</FormLabel>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha secreta"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            w="full"
            size="lg"
            isLoading={loading}
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>

          <Text fontSize="sm">
            {isLogin ? 'Ainda não tem uma conta? ' : 'Já possui uma conta? '}
            <Link color="blue.500" fontWeight="bold" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
