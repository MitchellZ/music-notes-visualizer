import * as React from 'react';

type NoteContextType = {
  noteName: string | null;
  clarity: number | null;
  peakValue: number | null;
};

const NoteContext = React.createContext<NoteContextType>({
  noteName: null,
  clarity: null,
  peakValue: null,
});

export default NoteContext;