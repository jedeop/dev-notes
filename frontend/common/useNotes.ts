import useSWRInfinite from 'swr/infinite';
import fetcher from './fetcher';
import { NoteListData } from './note';

const PAGE_LIMIT = 20;

interface useNotes {
  data: NoteListData[] | undefined
  error: any;
  isLoading: boolean;
  isValidating: boolean;
  loadMore: () => void;
}

function getKey(pageIndex: number, previousPageData: NoteListData | null) {
  if (previousPageData && previousPageData.list_complete) return null

  if (pageIndex === 0) return `/api/notes?limit=${PAGE_LIMIT}`

  return `/api/notes?cursor=${previousPageData?.cursor}&limit=${PAGE_LIMIT}`
}

export default function useNotes(): useNotes {
  const {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize
  } = useSWRInfinite<NoteListData>(getKey, fetcher)

  function loadMore() {
    setSize(size + 1);
  }

  return { 
    data,
    error,
    isLoading,
    isValidating,
    loadMore,
  };
}