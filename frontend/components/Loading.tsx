import { Coffee } from "react-feather";
import styles from "../styles/Loading.module.css";

interface Props {
}
export default function Loading({  }: Props) {
  return (
    <div className={styles.container}>
      <Coffee className={styles.loader} color="#949494" />
    </div>
  )
}