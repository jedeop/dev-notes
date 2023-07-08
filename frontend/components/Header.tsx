import Link from "next/link";
import { Coffee, LogIn } from "react-feather";
import useAdmin from "../common/useAdmin";
import styles from "../styles/Header.module.css";
import { Title } from "../common/title";

interface Props {
  title?: Title,
}
export default function Header({ title }: Props) {
  const { admin } = useAdmin();

  return (
    <header className={styles.container}>
      <Link href={title && title.name != "default" ? `/c/${title.name}` : "/"}>
        <div className={styles.left}>
          <h1 className={styles.text}>{title?.short_title}</h1>
          <Coffee />
        </div>
      </Link>
      {
        admin
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