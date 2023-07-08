import Note from "./Note";
import styles from "../styles/NoteList.module.css";
import useNotes from "../common/useNotes";
import useIntersect from "../common/useIntersect";
import Loading from "./Loading";

interface Props {
  category?: string,
}
export default function NoteList({ category }: Props) {
  const { data, error, isLoading, isValidating, loadMore } = useNotes(category);

  const loadMoreRef = useIntersect(() => {
    if (!data?.[data?.length - 1].list_complete && !isLoading && !isValidating) {
      loadMore();
    }
  });

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
      { isLoading || isValidating ? <Loading /> : null }
      <div ref={loadMoreRef}></div>
    </div>
  )
}