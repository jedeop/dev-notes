import { ChangeEvent, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import { mutate } from "swr";
import { NoteInputType } from "../common/note";
import styles from "../styles/CreateNote.module.css";
import Button from "./Button";

interface Option {
  value: string;
  label: string;
}
const options: Option[] = [
  { value: '깃털', label: '깃털' },
  { value: '개발 일지', label: '개발 일지' },
  { value: 'Bridge', label: 'Bridge' },
];

export default function CreateNote() {
  const [text, setText] = useState('');
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) { 
    setText(event.target.value);
  }

  const [project, setProject] = useState<Option | null>(null);
  const [tags, setTags] = useState<readonly Option[]>([]);

  const [step, setStep] = useState(0);

  async function handleSubmit() {
    if (!project) {
      return;
    }
    const body: NoteInputType = {
      content: text,
      project: project.label,
      tags: tags.map(tag => tag.label),
    }
    await fetch("/api/note", {
      method: "POST",
      body: JSON.stringify(body),
    })
    await mutate("/api/notes");
    
    setProject(null);
    setTags([]);
    setText("");
    setStep(0);
  }

  return (
    <div className={styles.container}>
      {
        step === 0
        ? (
          <>
            <textarea className={styles.textarea} placeholder="방금 무엇을 했나요?" rows={3} value={text} onChange={handleChange}></textarea>
            <div className={styles.foot}>
              <div className={styles.rightBtn}>
                <Button text="다음" onClick={() => {
                  if (text.length !== 0) {
                    setStep(1)
                  }
                }} />
              </div>
            </div>
          </>
        )
        : (
          <div className={styles.foot}>
            <CreatableSelect
              placeholder="프로젝트"
              isClearable
              classNames={{
                control: () => styles.selectControl,
                input: () => styles.selectInput,
                singleValue: () => styles.selectInput,
              }}
              defaultValue={project}
              onChange={setProject}
              options={options}
            />
            <CreatableSelect
              placeholder="태그"
              isClearable
              isMulti
              classNames={{
                control: () => styles.selectControl,
                input: () => styles.selectInput,
                multiValue: () => styles.multiValue,
                multiValueLabel: () => styles.multiValueGeneric,
                multiValueRemove: () => styles.multiValueRemove,
              }}
              defaultValue={tags}
              onChange={setTags}
              options={options}
            />
            <div className={styles.rightBtn}>
              <Button text="취소" type="stroke" onClick={() => setStep(0)} />
              <Button text="작성" onClick={handleSubmit} />
            </div>
          </div>
        )
      }
    </div>
  )
}