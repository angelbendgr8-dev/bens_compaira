import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import { selectAllMessages, selectVacancies } from '../reducers/message.reducer';

export const useMessages = () => {
  const vacancies = useSelector(selectVacancies);
  const individualMessages = useSelector(selectAllMessages);
  return useMemo(
    () => ({vacancies, individualMessages}),
    [vacancies,individualMessages],
  );
};
