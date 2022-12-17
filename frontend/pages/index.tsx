import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import Note from '../components/Note'
import CreateNote from '../components/CreateNote'

export default function Home() {
  return (
    <>
      <Head>
        <title>제덮 개발 일지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <CreateNote />
        <Note />
        <Note />
        <Note />
      </main>
    </>
  )
}
