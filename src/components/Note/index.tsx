import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { INote } from "../../interfaces/note";
import NoteForm from "../NoteForm";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

import { deleteNote as serviceDeleteNote } from "../../services/note";
import Loading from "../Loading";
interface INoteComponent {
  _id?: string;
  title?: string;
  description?: string;
  board?: string;
  reload: () => void;
}

const Note = ({ _id, title, description, board, reload }: INoteComponent) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const closeModal = () => {
    setEditModalOpen(false);
  };

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const deleteNote = async () => {
    try {
      setLoading(true);
      await serviceDeleteNote({ _id });
      reload();
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
      {editModalOpen && (
        <NoteForm
          isOpen={editModalOpen}
          type='edit'
          close={closeModal}
          note={{ _id, title, description }}
          reload={reload}
        />
      )}
      <Box
        w={"270px"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={""}
        h='min-content'
        p='16px'
      >
        <Center justifyContent='space-between' alignItems={"flex-start"}>
          <Heading overflow={"hidden"}>{title}</Heading>
          <Center flexDir={"column"} gap='4'>
            <DeleteIcon
              color={"red"}
              cursor='pointer'
              onClick={() => _id !== "0" && deleteNote()}
            />
            <EditIcon
              onClick={() => _id !== "0" && setEditModalOpen(true)}
              cursor='pointer'
            />
          </Center>
          {/* <NoteOptions _id={_id} title={title} description={description} /> */}
        </Center>
        <Collapse startingHeight={20} in={show}>
          {description}
        </Collapse>
        <Button size='sm' onClick={handleToggle} mt='1rem'>
          {show ? "Esconder" : "Mostrar"}
        </Button>
      </Box>
    </>
  );
};

export default Note;
