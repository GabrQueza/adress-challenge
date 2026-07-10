import React from 'react';
import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" bg="gray.900" color="white">
      <Box p={8} maxW="md" borderWidth={1} borderRadius={8} boxShadow="lg" bg="gray.800" textAlign="center">
        <Heading mb={4}>Dashboard</Heading>
        <Text mb={6}>Bem-vindo! Você fez login com sucesso.</Text>
        <Button colorScheme="red" onClick={handleLogout} w="full">
          Sair
        </Button>
      </Box>
    </Flex>
  );
};

export default Dashboard;
