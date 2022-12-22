import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import CreateNote from '../components/CreateNote'
import NoteList from '../components/NoteList'
import useAdmin from '../common/admin'

export default function Home() {
  const { admin } = useAdmin();
  return (
    <>
      <Head>
        <title>제덮 개발 일지</title>
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
        <NoteList />
      </main>
    </>
  )
}
