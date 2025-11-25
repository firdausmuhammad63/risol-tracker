import React, { useState } from 'react';
import { Plus, Search, TrendingUp, Package, Edit2, Check, X, User } from 'lucide-react';
import { RisolEntry } from '../types';
import { EntryCard } from '../components/EntryCard';
import { Button } from '../components/Button';

interface DashboardProps {
  entries: RisolEntry[];
  ownerName: string;
  onUpdateOwnerName: (name: string) => void;
  onAddClick: () => void;
  onViewDetail: (entry: RisolEntry) => void;
  onEditEntry: (entry: RisolEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  entries, 
  ownerName, 
  onUpdateOwnerName,
  onAddClick,
  onViewDetail,
  onEditEntry,
  onDeleteEntry
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(ownerName);
  const [searchQuery, setSearchQuery] = useState('');

  // Simple calculated stats (Global)
  const totalDropped = entries.reduce((acc, curr) => acc + curr.droppedQty, 0);
  const totalSold = entries.reduce((acc, curr) => acc + curr.soldQty, 0);

  // Filter entries based on search query
  const filteredEntries = entries.filter((entry) => 
    entry.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveName = () => {
    if (tempName.trim()) {
      onUpdateOwnerName(tempName);
      setIsEditingName(false);
    }
  };

  const cancelEditName = () => {
    setTempName(ownerName);
    setIsEditingName(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
            {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-[200px]">
                    <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-3 py-1 text-lg font-bold border-b-2 border-emerald-500 focus:outline-none bg-transparent"
                        autoFocus
                    />
                    <button onClick={saveName} className="p-1 bg-emerald-100 rounded-full text-emerald-600">
                        <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEditName} className="p-1 bg-red-100 rounded-full text-red-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                    <div className="bg-slate-100 p-2 rounded-full">
                        <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                         <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Hello, {ownerName}! 
                            <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                        <p className="text-slate-500 text-xs">Owner Account</p>
                    </div>
                </div>
            )}
        </div>
        
        <p className="text-slate-500 text-sm mt-4">Pantau penjualan risol hari ini.</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <Package className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">TOTAL TITIP</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{totalDropped}</p>
            </div>
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">TOTAL LAKU</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{totalSold}</p>
            </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input 
            type="text" 
            placeholder="Cari tempat penitipan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {searchQuery && (
            <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            >
                <X className="w-4 h-4" />
            </button>
        )}
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">
                {searchQuery ? 'Search Results' : 'Recents'}
            </h2>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {filteredEntries.length} Locations
            </span>
        </div>
        
        {entries.length === 0 ? (
            <div className="text-center py-12 opacity-50">
                <p>Belum ada data.</p>
            </div>
        ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 opacity-50 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-300" />
                <p>Tidak ditemukan pencarian untuk "{searchQuery}"</p>
            </div>
        ) : (
            filteredEntries.map((entry) => (
                <EntryCard 
                    key={entry.id} 
                    entry={entry} 
                    onDetail={() => onViewDetail(entry)}
                    onEdit={() => onEditEntry(entry)}
                    onDelete={() => onDeleteEntry(entry.id)}
                />
            ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
            onClick={onAddClick} 
            className="!rounded-full w-14 h-14 !p-0 shadow-xl shadow-emerald-500/30"
        >
            <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};