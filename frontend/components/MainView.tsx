import Head from "next/head";
import useAdmin from "../common/useAdmin";
import Header from "./Header";
import styles from '../styles/MainView.module.css'
import CreateNote from "./CreateNote";
import NoteList from "./NoteList";

interface Props {
  title?: string,
  category?: string,
}
export default function MainView({ title, category }: Props) {
  const { admin } = useAdmin();
  return (
    <>
      <Head>
        <title>{ title || "제덮 개발 일지"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        {
          admin
          ? <CreateNote />
          : <></>
        }
        <NoteList category={category} />
      </main>
    </>
  )
}