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
  category: string | undefined,
}

export interface NoteListData {
  keys: {
    name: string,
    // expiration: null,
    // metadata: null
  }[];
  list_complete: boolean;
  cursor: string | null;
}