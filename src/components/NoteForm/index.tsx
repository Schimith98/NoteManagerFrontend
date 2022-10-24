import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { INote } from "../../interfaces/note";
import { createNote, editNote } from "../../services/note";
import Loading from "../Loading";

interface INoteEditForm {
  note?: INote;
  isOpen: boolean;
  type: "new" | "edit";
  close: () => void;
  reload?: () => void;
}

const NoteForm = ({ isOpen, note, type, close, reload }: INoteEditForm) => {
  const [title, setTitle] = useState<string | undefined>(note?.title);
  const [description, setDescription] = useState<string | undefined>(
    note?.description
  );

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const setNote = async () => {
    try {
      setLoading(true);
      if (type === "new" && !!note) {
        const body = {
          title,
          description,
          board: note.board,
        };
        await createNote(body);
        toast({
          title: "Sucesso!",
          description: "Nota criada com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      if (type === "edit" && !!note) {
        const body = {
          title,
          description,
          _id: note._id,
        };
        await editNote(body);
        toast({
          title: "Sucesso!",
          description: "Nota editada com sucesso",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        !!reload && reload();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro!",
        description: "Falha ao acessar o servidor, tente novamnete mais tarde",
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
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {type === "new" && "Criar"} {type === "edit" && "Editar"} nota
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Título</FormLabel>
              <Input
                placeholder='Título'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                placeholder='Descrição'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={setNote}>
              Salvar
            </Button>
            <Button onClick={close}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NoteForm;
