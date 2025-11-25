import React from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, ArrowUpRight, ArrowDownLeft, PieChart } from 'lucide-react';
import { RisolEntry } from '../types';

interface EntryDetailProps {
  entry: RisolEntry;
  onBack: () => void;
}

export const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onBack }) => {
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(entry.timestamp);

  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(entry.timestamp);

  const calculateSellRate = () => {
    if (entry.droppedQty === 0) return 0;
    return Math.round((entry.soldQty / entry.droppedQty) * 100);
  };

  const sellRate = calculateSellRate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      <div className="relative h-72 w-full bg-slate-200">
        <img 
            src={entry.imageUrl} 
            alt={entry.placeName} 
            className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10"></div>
        
        {/* Navigation */}
        <button 
            onClick={onBack} 
            className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
        >
           <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
      </div>
      
      {/* Content Container (Sheet style) */}
      <div className="relative -mt-8 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] px-6 py-8 min-h-[calc(100vh-280px)]">
         {/* Header */}
         <div className="mb-6">
             <div className="flex items-start justify-between mb-2">
                 <h1 className="text-2xl font-bold text-slate-800 leading-tight">{entry.placeName}</h1>
                 <div className="flex flex-col items-center justify-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                     <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Rate</span>
                     <span className="text-lg font-bold text-emerald-700">{sellRate}%</span>
                 </div>
             </div>
             <div className="flex flex-wrap gap-3 mt-3">
                 <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                     <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                     {entry.location}
                 </div>
                 <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                     <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                     {formattedDate}
                 </div>
                  <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                     <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                     {formattedTime}
                 </div>
             </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                 <div className="p-2 bg-white rounded-full shadow-sm mb-2 text-emerald-500">
                    <ArrowUpRight className="w-5 h-5" />
                 </div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Barang Titip</span>
                 <span className="text-3xl font-bold text-emerald-700">{entry.droppedQty}</span>
             </div>
             <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                 <div className="p-2 bg-white rounded-full shadow-sm mb-2 text-blue-500">
                    <ArrowDownLeft className="w-5 h-5" />
                 </div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Barang Laku</span>
                 <span className="text-3xl font-bold text-blue-700">{entry.soldQty}</span>
             </div>
         </div>

         {/* Description */}
         <div className="space-y-3">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
                 Catatan Tambahan
             </h3>
             <p className="text-slate-600 leading-relaxed text-sm">
                 {entry.description || "Tidak ada catatan untuk tempat ini."}
             </p>
         </div>

      </div>
    </div>
  );
};