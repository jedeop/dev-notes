export interface NoteType {
  id: string,
  date: string,
  content: string,
  project: string,
  tags: string[],
}

export interface NoteInputType {
  content: string,
  project: string,
  tags: string[],
}