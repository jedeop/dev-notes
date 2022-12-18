import Link from "next/link";
import { Coffee, LogIn } from "react-feather";
import { useToken } from "../common/token";
import styles from "../styles/Header.module.css";

export default function Header() {
  const [token] = useToken();
  return (
    <header className={styles.container}>
      <Link href="/">
        <div className={styles.left}>
          <h1 className={styles.text}>개발 일지</h1>
          <Coffee />
        </div>
      </Link>
      {
        token
        ? <div></div>
        : (
        <Link href="/login" className={styles.right}>
          <LogIn color="#949494" size={18} />
        </Link>
        )
      }
    </header>
  )
}