import { Coffee } from "react-feather";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.container}>
      <h1 className={styles.text}>개발 일지</h1>
      <Coffee />
    </header>
  )
}