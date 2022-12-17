import { MoreHorizontal } from "react-feather";
import styles from "../styles/Note.module.css";
import Tag from "./Tag";

export default function Note() {
  return (
    <div className={styles.container}>
      <div className={styles.date}>2022년 12월 17일 (토) 오후 5시 20분</div>
      <div className={styles.text}>일어나아 날에 만나면 능력이 구월에 이러하는 상투적은 오라. 농성하여 경찰관이라도 머릿속은, 결정하는 이른바 암소의 대하게 뿐 주거든 이르다. 한다 있는 주되라 것, 인정하여요.</div>
      <div className={styles.foot}>
        <div className={styles.tags}>
          <Tag text="깃털" />
          <Tag text="기능 개발" type="stroke" />
        </div>
        <MoreHorizontal color="#949494" size={18} />
      </div>
    </div>
  )
}