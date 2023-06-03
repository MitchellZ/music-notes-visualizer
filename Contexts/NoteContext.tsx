import * as React from 'react';

type NoteContextType = {
  noteName: string | null;
  setNoteName: (name: string | null) => void;
};

const NoteContext = React.createContext<NoteContextType>({
  noteName: null,
  setNoteName: () => {},
});

export default NoteContext;