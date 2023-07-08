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

function getKeyFn(category?: string) {
  return function getKey(pageIndex: number, previousPageData: NoteListData | null) {
    if (previousPageData && previousPageData.list_complete) return null

    let key = `/api/notes?limit=${PAGE_LIMIT}`;
    
    if (category) key += '&category=' + category;

    if (pageIndex === 0) return key;

    return key + '&cursor=' + previousPageData?.cursor;
  }
}

export default function useNotes(category?: string): useNotes {
  const {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize
  } = useSWRInfinite<NoteListData>(getKeyFn(category), fetcher)

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