import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import {map,isEmpty} from 'lodash';
import EmptyChat from './EmptyChat';
import { useMessages } from '@/state/hooks/messages.hook';
import ChatItem from './ChatItem';

const ChatList = ({select,selected}: {select: any,selected:any}) => {
  const {vacancies} = useMessages()

  return (
    <Box  >
        {
            isEmpty(vacancies)?(
                <EmptyChat/>
            ):(
              map(vacancies,(vacancy)=> (
                <ChatItem selected={selected} select={select} vacancy={vacancy}/>
              ))
            )
        }
    </Box>
  )
}

export default ChatList;
