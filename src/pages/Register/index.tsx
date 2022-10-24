import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

import { signUp as signUpService } from "../../services/auth";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const signup = async () => {
    try {
      setLoading(true);
      const response = await signUpService({ name, email, password });
      if (response.status === 201) {
        toast({
          title: "Sucesso!",
          description: response.data.msg,
          status: "success",
          duration: 90000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      if (error.response.status === 422) {
        toast({
          title: "Erro 422",
          description: error.response.data.msg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha tente novamente mais tarde!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Flex
        minH={"calc(100vh - 64px)"}
        align={"center"}
        justify={"center"}
        bg={"blue.300"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Cadastre-se
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              para aproveitar todos os nossos recursos interessantes ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id='firstName' isRequired>
                <FormLabel>Nome:</FormLabel>
                <Input type='text' onChange={(e) => setName(e.target.value)} />
              </FormControl>

              <FormControl id='email' isRequired>
                <FormLabel>Endereço de email:</FormLabel>
                <Input
                  type='email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id='password' isRequired>
                <FormLabel>Senha:</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText='Submitting'
                  size='lg'
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={signup}
                >
                  Cadastrar
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Já é um usuário?{" "}
                  <Link color={"blue.400"} href={"/"}>
                    Entre
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <Footer />
    </>
  );
};

export default Register;
