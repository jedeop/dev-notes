import fetcher from "../common/fetcher";
import useSWR from 'swr'
import Note from "./Note";

interface NoteListData {
  keys: {
    name: string,
    // expiration: null,
    // metadata: null
  }[];
  list_complete: boolean;
  cursor: string | null;
}

export default function NoteList() {
  const { data, error, isLoading } = useSWR<NoteListData>('/api/notes', fetcher)

  return (
    <div>
      {data?.keys.map(({name}) => (<Note key={name} id={name} />))}
    </div>
  )
}