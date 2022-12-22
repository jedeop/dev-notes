import useSWR from 'swr';
import { fetcherWithToken } from './fetcher';
import { useToken } from './token';

interface useAdmin {
  admin: boolean | undefined;
  error: any;
  isLoading: boolean;
}
export default function useAdmin(): useAdmin {
  const [token] = useToken();
  const { data, error, isLoading } = useSWR<{ admin: boolean }>(['/api/auth/admin', token], fetcherWithToken)

  return { 
    admin: data?.admin,
    error,
    isLoading
  };
}