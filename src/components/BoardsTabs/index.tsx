import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import Note from "../Note";
import { IBoard } from "../../interfaces/board";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import NoteForm from "../NoteForm";
import { INote } from "../../interfaces/note";
import { getNotes as serviceGetNotes } from "../../services/note";
import ShareModal from "../ShareModal";
import Loading from "../Loading";
interface IBoardsTabs {
  boards: IBoard[];
  createBoard: () => void;
  deleteBoard: (_id: string | undefined) => void;
  container: string;
}

const BoardsTabs = ({
  boards,
  createBoard,
  deleteBoard,
  container,
}: IBoardsTabs) => {
  const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);
  const closeModal = () => setNoteModalOpen(false);

  const [note, setNote] = useState<INote | undefined>(undefined);
  const [notes, setNotes] = useState<INote[] | undefined>(undefined);

  const [tabIndex, setTabIndex] = useState(0);

  const [update, setUpdate] = useState<boolean>(false);
  const reload = () => setUpdate(!update);

  const [loading, setLoading] = useState<boolean>(false);

  const getNotes = async (boardId: string | undefined) => {
    try {
      setLoading(true);
      const response = !!boardId && (await serviceGetNotes({ board: boardId }));

      response && setNotes(response.data.notes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tabIndex < boards.length && getNotes(boards[tabIndex]._id);
    // console.log(tabIndex);
  }, [tabIndex, boards, noteModalOpen, update]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {noteModalOpen && (
        <NoteForm
          isOpen={noteModalOpen}
          note={note}
          close={closeModal}
          type={"new"}
        />
      )}
      <Tabs
        m='5'
        variant='soft-rounded'
        onChange={(index) => setTabIndex(index)}
      >
        <TabList flexWrap={"wrap"}>
          {boards.map((board, i) => (
            <Tab _selected={{ color: "Black", bg: "white" }}>
              Quadro {i + 1}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {boards.map((board, i) => (
            <TabPanel>
              {container === "adm" && (
                <Flex
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p='4px 16px'
                  mb={"16px"}
                  gap={5}
                  bgColor={"white"}
                  borderRadius='full'
                >
                  <Flex gap={5} m='16px 0 '>
                    <Flex
                      gap={2}
                      alignItems={"center"}
                      color='black'
                      cursor={"pointer"}
                      onClick={() => createBoard()}
                    >
                      <AddIcon width={"20px"} height={"20px"} />
                      Criar Quadro
                    </Flex>
                    <ShareModal viwerBoards={board.viwer} boardId={board._id} />
                  </Flex>
                  <DeleteIcon
                    width={"20px"}
                    height='20px'
                    cursor={"pointer"}
                    color={"red"}
                    onClick={() => {
                      deleteBoard(board._id);
                    }}
                  />
                </Flex>
              )}
              <Flex flexWrap={"wrap"} gap='16px'>
                {notes?.map((n, i) => (
                  <Note
                    _id={n._id}
                    title={n.title}
                    description={n.description}
                    board={n.board}
                    reload={reload}
                  />
                ))}
                {notes?.length === 0 && (
                  <Note
                    _id={"0"}
                    title={"Quadro vazio"}
                    description={
                      "Clique no botão ao lado para criar uma nova nota"
                    }
                    board={"0"}
                    reload={reload}
                  />
                )}
                <Flex
                  gap={2}
                  alignItems={"center"}
                  color='white'
                  cursor={"pointer"}
                  onClick={() => {
                    setNote({
                      title: "",
                      description: "",
                      board: board?._id,
                    });
                    setNoteModalOpen(true);
                  }}
                >
                  <AddIcon width={"20px"} height={"20px"} />
                  Nova nota
                </Flex>
              </Flex>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default BoardsTabs;
