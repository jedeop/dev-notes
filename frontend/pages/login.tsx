import Head from 'next/head'
import styles from '../styles/Login.module.css'
import Header from '../components/Header'
import Button from '../components/Button'
import { ChangeEvent, useState } from 'react'
import { useToken } from '../common/token'
import { useRouter } from 'next/router'

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setToken] = useToken();
  const router = useRouter();

  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  async function handleLogin() {
    if (password.length === 0) return;

    try {
      let res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          password,
        })
      });
      if (!res.ok) {
        throw new Error(`An error occurred while fetching the data: ${res.status} ${await res.text()}`)
      }
      let { token }: { token: string } = await res.json();
      setToken(token);
      router.push('/');
      // router.back();
    } catch (error) {
      setError(`${error}`);
      setPassword('');
    }
  }

  return (
    <>
      <Head>
        <title>로그인 - 제덮 개발 일지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <div className={styles.main}>
          <input className={styles.input} type="password" placeholder="비밀번호" value={password} onChange={handlePassword} />
          <Button text='로그인' onClick={handleLogin} />
        </div>
        <div>{error}</div>
      </main>
    </>
  )
}
