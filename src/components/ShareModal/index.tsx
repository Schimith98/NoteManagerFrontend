import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import { HiOutlineShare } from "react-icons/hi";
import userEvent from "@testing-library/user-event";
import { useAuth } from "../../context/auth";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  addViwer as serviceAddViwer,
  delViwer as serviceDelViwer,
} from "../../services/board";
import Loading from "../Loading";

interface IShareModal {
  viwerBoards: string[] | undefined;
  boardId: string | undefined;
}

const ShareModal = ({ viwerBoards, boardId }: IShareModal) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [viwerId, setViwerId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const addViwer = async () => {
    try {
      setLoading(true);
      await serviceAddViwer({ _id: boardId, viwer: viwerId });
      toast({
        title: "Sucesso!",
        description: "Visualizador adicionado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro!",
        description: "Falha ao adicionar",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const delViwer = async (viwerId: string) => {
    try {
      setLoading(true);
      await serviceDelViwer({ _id: boardId, viwer: viwerId });
      toast({
        title: "Sucesso!",
        description: "Visualizador removido com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro!",
        description: "Falha ao remover",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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
        gap={2}
        alignItems={"center"}
        color='black'
        cursor={"pointer"}
        onClick={onOpen}
      >
        <HiOutlineShare size={"24px"} />
        Compartilhar
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gerenciar compartilhamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Adicionar visualizador</FormLabel>
              <Input
                placeholder='ID do visualizador'
                value={viwerId}
                onChange={(e) => setViwerId(e.target.value)}
              />
            </FormControl>
            <List>
              {viwerBoards?.map((vb, i) => (
                <ListItem
                  display={"flex"}
                  justifyContent={"space-evenly"}
                  mt='4'
                >
                  {vb}
                  <DeleteIcon
                    width={"20px"}
                    height='20px'
                    cursor={"pointer"}
                    color={"red"}
                    onClick={() => {
                      delViwer(vb);
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={addViwer}>
              Salvar
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareModal;
