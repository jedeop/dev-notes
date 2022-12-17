import styles from "../styles/Tag.module.css";

interface Props {
  text: string;
  type?: 'fill' | 'stroke';
}
export default function Tag({ text, type }: Props) {
  return (
    <div className={[styles.container, type === 'stroke' ? styles.stroke : styles.fill].join(' ')}>
      {text}
    </div>
  )
}