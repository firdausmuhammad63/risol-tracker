import React from 'react';
import { MapPin, Clock, ArrowUpRight, ArrowDownLeft, Pencil, Trash2, Eye } from 'lucide-react';
import { RisolEntry } from '../types';

interface EntryCardProps {
  entry: RisolEntry;
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDetail, onEdit, onDelete }) => {
  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  }).format(entry.timestamp);

  const calculateSellRate = () => {
    if (entry.droppedQty === 0) return 0;
    return Math.round((entry.soldQty / entry.droppedQty) * 100);
  };

  const sellRate = calculateSellRate();

  return (
    <div className="group relative bg-white rounded-3xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden">
      <div className="flex gap-4">
        {/* Thumbnail Image */}
        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative cursor-pointer" onClick={onDetail}>
            <img 
                src={entry.imageUrl} 
                alt={entry.placeName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
             {/* Badge Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                <p className="text-[10px] text-white text-center font-medium">
                    {sellRate}% Laku
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div onClick={onDetail} className="cursor-pointer">
            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 pr-16">{entry.placeName}</h3>
            <div className="flex items-center text-slate-400 text-xs mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[140px]">{entry.location}</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-emerald-50 rounded-lg p-1.5 flex flex-col items-center justify-center min-w-[50px]">
                    <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-tight flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> Titip
                    </span>
                    <span className="text-sm font-bold text-emerald-700">{entry.droppedQty}</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-1.5 flex flex-col items-center justify-center min-w-[50px]">
                    <span className="text-[10px] text-blue-600 font-medium uppercase tracking-tight flex items-center">
                        <ArrowDownLeft className="w-3 h-3 mr-0.5" /> Laku
                    </span>
                    <span className="text-sm font-bold text-blue-700">{entry.soldQty}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 relative z-10">
                {onDetail && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDetail(); }}
                        className="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        aria-label="View details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                )}
                {onEdit && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        aria-label="Edit entry"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
                {onDelete && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-2 bg-slate-50 hover:bg-red-50 rounded-xl text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                        aria-label="Delete entry"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Time Stamp Badge */}
      <div className="absolute top-3 right-3 flex items-center bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
        <Clock className="w-3 h-3 text-slate-400 mr-1" />
        <span className="text-[10px] font-medium text-slate-500">{formattedTime}</span>
      </div>
    </div>
  );
};