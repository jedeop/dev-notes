import Note from "./Note";
import styles from "../styles/NoteList.module.css";
import useNotes from "../common/useNotes";
import useIntersect from "../common/useIntersect";

export default function NoteList() {
  const { data, error, isLoading, isValidating, loadMore } = useNotes();

  const loadMoreRef = useIntersect(() => {
    if (!data?.[data?.length - 1].list_complete && !isLoading && !isValidating) {
      loadMore();
    }
  });

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
      {data?.map(notes => notes.keys.map(({name}) => (<Note key={name} id={name} />)))}
      <div ref={loadMoreRef}></div>
    </div>
  )
}