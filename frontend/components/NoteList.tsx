import fetcher from "../common/fetcher";
import useSWR from 'swr'
import Note from "./Note";
import styles from "../styles/NoteList.module.css";

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

  if (isLoading) {
    return (
      <div>
        로딩 중
      </div>
    )
  }

  if (error) {
    return (
      <div>
        에러 발생: {`${error}`}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {data?.keys.map(({name}) => (<Note key={name} id={name} />))}
    </div>
  )
}