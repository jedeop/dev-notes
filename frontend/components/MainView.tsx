import Head from "next/head";
import useAdmin from "../common/useAdmin";
import Header from "./Header";
import styles from '../styles/MainView.module.css'
import CreateNote from "./CreateNote";
import NoteList from "./NoteList";
import { Title } from "../common/title";

interface Props {
  title: Title,
  category?: string,
}
export default function MainView({ title, category }: Props) {
  const { admin } = useAdmin();
  return (
    <>
      <Head>
        <title>{ title.long_title }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={title} />
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