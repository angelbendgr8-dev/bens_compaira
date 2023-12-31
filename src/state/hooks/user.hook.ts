import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {
  selectUser,
  selectToken,
  selectIsLoading,
  selectError,
  selectData,
  selectEmail,
  selectRoute,
  selectLogout,
} from '../reducers/auth.reducer';

export const useAuth = () => {
  const user = useSelector(selectUser);
  const prevRoute = useSelector(selectRoute);
  const token = useSelector(selectToken);
  const logout = useSelector(selectLogout);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const data = useSelector(selectData);
  const resetEmail = useSelector(selectEmail);


  return useMemo(
    () => ({user, token, loading,error,data,resetEmail,prevRoute, logout}),
    [user, token, loading,error,data,resetEmail,prevRoute, logout],
  );
};
