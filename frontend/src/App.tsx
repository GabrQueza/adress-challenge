import { Box, Heading, Text, VStack } from '@chakra-ui/react'

function App() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <VStack spacing={4} textAlign="center">
        <Heading size="2xl" color="blue.600">
          Address Challenge
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Frontend com React, Vite e Chakra UI.
        </Text>
      </VStack>
    </Box>
  )
}

export default App
