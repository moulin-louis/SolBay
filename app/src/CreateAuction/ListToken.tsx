import {FC, useState} from "react";
import {Box, Button, Collapse, Input} from "@chakra-ui/react";
import {FixedSizeList as List} from "react-window";
import {t_token} from "./FetchToken.tsx";

interface ListTokenProps {
  tokens: t_token[],
  onSelectToken: (tokenAddress: t_token) => void
}

export const ListToken: FC<ListTokenProps> = ({tokens, onSelectToken}) => {
  const [showList, setShowList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box>
      <Button onClick={() => setShowList(!showList)} mb={4}>
        {showList ? 'Hide Tokens' : 'Choose a Token'}
      </Button>
      {showList &&
          <Collapse in={showList} animateOpacity>
              <Box maxH="400px" maxW="400px" p={4} borderWidth="1px" borderRadius="md" boxShadow="md"
                   overflowY="hidden">
                  <Input
                      placeholder="Search for a token..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      mb={4}
                  />
                  <List height={400} itemCount={filteredTokens.length} itemSize={35} witdth={'100%'}>
                    {({index, style}) => (
                      <div style={style}>
                        <Button onClick={() => onSelectToken(filteredTokens[index])}>
                          {filteredTokens[index].name}
                        </Button>
                      </div>
                    )}
                  </List>
              </Box>
          </Collapse>
      }
    </Box>
  );
};