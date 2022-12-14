import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../../context/auth";

const Links: { container: "adm" | "viwer"; name: string }[] = [
  {
    container: "adm",
    name: "Meus quadros",
  },
  {
    container: "viwer",
    name: "Quadros compartilhados",
  },
];
interface INavbar {
  handleContainer: (newContainer: "adm" | "viwer") => void;
}

export default function Navbar({ handleContainer }: INavbar) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, signOut } = useAuth();

  const toast = useToast();

  const sendToclipboard = () => {
    navigator.clipboard.writeText(user?._id || "");
    toast({
      title: "Sucesso!",
      description: "Id copiado para a área de transferência",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box bg={"white"} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box fontWeight={"bold"}>Note Manager</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <Link
                  key={link.name}
                  onClick={() => handleContainer(link.container)}
                >
                  {link.name}
                </Link>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={"https://www.w3schools.com/howto/img_avatar.png"}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>{user?.name}</MenuItem>
                <MenuItem onClick={sendToclipboard}>
                  <Text>
                    ID de compartilhamento
                    <br />
                    {user?._id}
                  </Text>
                </MenuItem>
                <MenuItem onClick={signOut}>Sair</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <Link
                  key={link.name}
                  onClick={() => handleContainer(link.container)}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
