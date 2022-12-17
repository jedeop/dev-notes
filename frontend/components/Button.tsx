import styles from "../styles/Button.module.css";

interface Props {
  text: string;
  type?: 'fill' | 'stroke';
  className?: string;
  onClick?: () => void;
}
export default function Button({ text, type, className, onClick }: Props) {
  return (
    <input className={[styles.container, type === 'stroke' ? styles.stroke : styles.fill, className].join(' ')}
      type='button'
      value={text}
      onClick={onClick}
    />
  )
}