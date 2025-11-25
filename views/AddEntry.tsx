import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, MapPin, Calendar, Save, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { RisolEntry } from '../types';

interface AddEntryProps {
  onBack: () => void;
  onSave: (entry: RisolEntry) => void;
  initialData?: RisolEntry;
}

export const AddEntry: React.FC<AddEntryProps> = ({ onBack, onSave, initialData }) => {
  const [image, setImage] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Jakarta Pusat');
  const [droppedQty, setDroppedQty] = useState<string>('');
  const [soldQty, setSoldQty] = useState<string>('');
  
  const [isCapturing, setIsCapturing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Load initial data for editing
  useEffect(() => {
    if (initialData) {
      setImage(initialData.imageUrl);
      setPlaceName(initialData.placeName);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setDroppedQty(initialData.droppedQty.toString());
      setSoldQty(initialData.soldQty.toString());
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (saveToGallery: boolean) => {
    if (!placeName || !droppedQty) {
        alert("Mohon isi nama tempat dan jumlah titipan.");
        return;
    }

    const newEntry: RisolEntry = {
      id: initialData ? initialData.id : Date.now().toString(),
      placeName,
      description,
      location,
      droppedQty: parseInt(droppedQty) || 0,
      soldQty: parseInt(soldQty) || 0,
      timestamp: initialData ? initialData.timestamp : new Date(),
      imageUrl: image || 'https://picsum.photos/400/300', // Default placeholder if no image
    };

    if (saveToGallery && receiptRef.current) {
        setIsCapturing(true);
        // Small delay to ensure rendering updates if needed
        setTimeout(async () => {
            if (!receiptRef.current) return;
            try {
                const canvas = await html2canvas(receiptRef.current, {
                    backgroundColor: '#ffffff',
                    scale: 2
                });
                const link = document.createElement('a');
                link.download = `Risol-Recap-${placeName}-${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } catch (err) {
                console.error("Failed to capture image", err);
            } finally {
                setIsCapturing(false);
                onSave(newEntry);
            }
        }, 100);
    } else {
        onSave(newEntry);
    }
  };

  return (
    <div className="pb-8 min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Data' : 'Tambah Data Baru'}
        </h1>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        
        {/* Image Upload Area */}
        <div className="relative group w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/10">
            {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center text-slate-400">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                        <Camera className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-xs font-medium">Tap to upload photo</p>
                </div>
            )}
            <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
            />
             {image && (
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                     <p className="text-white font-medium text-sm flex items-center"><ImageIcon className="w-4 h-4 mr-2"/> Ganti Foto</p>
                 </div>
             )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
            <Input 
                label="Nama Tempat" 
                placeholder="Contoh: Kantin Sekolah A"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                autoFocus={!initialData}
            />
            
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Jumlah Titip" 
                    type="number" 
                    placeholder="0"
                    value={droppedQty}
                    onChange={(e) => setDroppedQty(e.target.value)}
                />
                <Input 
                    label="Jumlah Laku" 
                    type="number" 
                    placeholder="0"
                    value={soldQty}
                    onChange={(e) => setSoldQty(e.target.value)}
                />
            </div>

            <TextArea 
                label="Deskripsi Singkat"
                placeholder="Catatan tambahan (misal: Rame saat jam istirahat)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Context Info */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center text-sm text-slate-600 border-b border-slate-100 pb-2">
                    <Calendar className="w-4 h-4 mr-3 text-emerald-500" />
                    <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-3 text-emerald-500" />
                    <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-transparent border-none p-0 focus:ring-0 w-full text-slate-700 font-medium"
                    />
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
            <Button 
                onClick={() => handleSave(false)} 
                fullWidth 
                variant="primary"
                icon={<Save className="w-4 h-4" />}
            >
                {initialData ? 'Simpan Perubahan' : 'Simpan Data'}
            </Button>
            <Button 
                onClick={() => handleSave(true)} 
                fullWidth 
                variant="secondary"
                icon={<Download className="w-4 h-4" />}
                disabled={isCapturing}
            >
                {isCapturing ? 'Generating Image...' : 'Simpan ke Galeri & Close'}
            </Button>
        </div>
      </div>

      {/* Hidden Receipt for Capture */}
      <div className="absolute top-0 left-[-9999px]">
        <div ref={receiptRef} className="w-[400px] bg-white p-8 rounded-none border border-slate-200 font-sans">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Risol Tracker Recap</h2>
                <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleString()}</p>
            </div>
            
            {image && (
                <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-slate-100">
                    <img src={image} className="w-full h-full object-cover" alt="Location" />
                </div>
            )}

            <div className="space-y-4 mb-8">
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Lokasi</p>
                    <p className="text-lg font-bold text-slate-800">{placeName}</p>
                    <p className="text-sm text-slate-500">{location}</p>
                </div>
                {description && (
                     <div>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Catatan</p>
                        <p className="text-sm text-slate-700 italic">"{description}"</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Dititip</p>
                    <p className="text-3xl font-bold text-emerald-700">{droppedQty || 0}</p>
                    <p className="text-[10px] text-emerald-500">Pcs</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">Terjual</p>
                    <p className="text-3xl font-bold text-blue-700">{soldQty || 0}</p>
                    <p className="text-[10px] text-blue-500">Pcs</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium">Generated by Risol Tracker App</p>
            </div>
        </div>
      </div>

    </div>
  );
};