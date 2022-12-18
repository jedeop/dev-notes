import { MoreHorizontal } from "react-feather";
import { NoteType } from "../common/note";
import styles from "../styles/Note.module.css";
import Tag from "./Tag";
import useSWR from "swr";
import fetcher from "../common/fetcher";
import parseJSON from "date-fns/parseJSON";
import format from "date-fns/format";
import ko from "date-fns/locale/ko/index.js";
import { useToken } from "../common/token";

interface Props {
  id: string,
}
export default function Note({ id }: Props) {
  const [token] = useToken();

  const { data, error, isLoading } = useSWR<NoteType>(`/api/note/${id}`, fetcher)

  if (isLoading) {
    return (
      <div className={styles.container}>
        로딩 중
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        에러 발생: {`${error}`}
      </div>
    )
  }

  const note = data!;

  return (
    <div className={styles.container}>
      <div className={styles.date}>{format(parseJSON(note.date), "y년 M월 d일 (E) a h시 m분", { locale: ko })}</div>
      <div className={styles.text}>{note.content}</div>
      <div className={styles.foot}>
        <div className={styles.tags}>
          <Tag text={note.project} />
          {note.tags.map(tag => (<Tag text={tag} key={tag} type="stroke" />))}
        </div>
        {
          token
          ? <MoreHorizontal color="#949494" size={18} />
          : <></>
        }
      </div>
    </div>
  )
}