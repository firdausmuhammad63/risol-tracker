import React, { useState } from 'react';
import { ViewState, RisolEntry } from './types';
import { Dashboard } from './views/Dashboard';
import { AddEntry } from './views/AddEntry';
import { EntryDetail } from './views/EntryDetail';

// Mock initial data
const MOCK_DATA: RisolEntry[] = [
  {
    id: '1',
    placeName: 'Kantin SMA 1',
    description: 'Titip di meja bu Ani, dekat kasir.',
    location: 'Jakarta Selatan',
    droppedQty: 50,
    soldQty: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    placeName: 'Warung Kopi Mas Budi',
    description: 'Titip pagi jam 6.',
    location: 'Jakarta Barat',
    droppedQty: 30,
    soldQty: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    imageUrl: 'https://picsum.photos/400/300?random=2'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [entries, setEntries] = useState<RisolEntry[]>(MOCK_DATA);
  const [ownerName, setOwnerName] = useState('Owner');
  const [editingEntry, setEditingEntry] = useState<RisolEntry | undefined>(undefined);
  const [selectedEntry, setSelectedEntry] = useState<RisolEntry | undefined>(undefined);

  const handleSaveEntry = (entry: RisolEntry) => {
    if (editingEntry) {
      // Update existing - use functional update to prevent stale state
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
    } else {
      // Add new - use functional update
      setEntries(prev => [entry, ...prev]);
    }
    setEditingEntry(undefined);
    setView('dashboard');
  };

  const handleEditClick = (entry: RisolEntry) => {
    setEditingEntry(entry);
    setView('add-entry');
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah anda yakin ingin menghapus data ini?')) {
      // Use functional update to ensure we are filtering the most current list of entries
      setEntries(prevEntries => prevEntries.filter(e => e.id !== id));
    }
  };

  const handleViewDetail = (entry: RisolEntry) => {
    setSelectedEntry(entry);
    setView('detail');
  };

  const handleAddClick = () => {
    setEditingEntry(undefined);
    setView('add-entry');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        {view === 'dashboard' && (
          <Dashboard 
            entries={entries} 
            ownerName={ownerName}
            onUpdateOwnerName={setOwnerName}
            onAddClick={handleAddClick}
            onViewDetail={handleViewDetail}
            onEditEntry={handleEditClick}
            onDeleteEntry={handleDeleteClick}
          />
        )}
        
        {view === 'add-entry' && (
          <AddEntry 
            initialData={editingEntry}
            onBack={() => {
              setEditingEntry(undefined);
              setView('dashboard');
            }} 
            onSave={handleSaveEntry} 
          />
        )}

        {view === 'detail' && selectedEntry && (
            <EntryDetail 
                entry={selectedEntry}
                onBack={() => {
                    setSelectedEntry(undefined);
                    setView('dashboard');
                }}
            />
        )}
      </div>
    </div>
  );
};

export default App;