import { useState, useRef } from 'react';
import { DEPT_HEADS } from '../config/routing';
import { uploadPhoto } from '../lib/tickets';
import { font, colors, shared } from '../config/styles';

export default function ReportDetails({ category, onSubmit, onBack }) {
  const [photos, setPhotos] = useState([]);       // { file, preview, url }
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const head = DEPT_HEADS[category.head];

  // Get GPS location
  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        // Reverse geocode via browser or simple fallback
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const road = data.address?.road || '';
          const house = data.address?.house_number || '';
          setAddress(`${house} ${road}, Waltham, MA`.trim().replace(/^,/, '').trim());
        } catch {
          setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setLocating(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle photo selection
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - photos.length);
    const newPhotos = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      url: null,
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  // Submit
  const handleSubmit = async () => {
    if (!address) {
      alert('Please add a location for the issue.');
      return;
    }
    setUploading(true);
    try {
      // Upload photos (skip in dev if Supabase not configured)
      const photoUrls = [];
      for (const p of photos) {
        try {
          const url = await uploadPhoto(p.file, 'temp');
          photoUrls.push(url);
        } catch {
          // Photo upload optional — continue without
        }
      }

      onSubmit({
        address,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        description: desc,
        photoUrls,
        photoCount: photos.length,
      });
    } catch (err) {
      console.error('Submit error:', err);
      // Submit anyway with local data
      onSubmit({ address, description: desc, photoUrls: [], photoCount: photos.length });
    }
    setUploading(false);
  };

  return (
    <div style={shared.screen}>
      <div style={shared.topBar}>
        <button onClick={onBack} style={shared.backBtn}>← Back</button>
        <span style={shared.step}>Step 2 of 3</span>
      </div>

      {/* Selected category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#EBF4FF', borderRadius: 14, padding: '12px 16px', margin: '8px 0 16px' }}>
        <span style={{ fontSize: 28 }}>{category.icon}</span>
        <div>
          <strong style={{ fontSize: 16, color: colors.navy, display: 'block' }}>{category.label}</strong>
          <span style={{ fontSize: 12, color: colors.blue, fontWeight: 500 }}>→ {head.name}, {head.dept}</span>
        </div>
      </div>

      {category.urgent && (
        <div style={{ background: 'linear-gradient(90deg, #FFF5E6, #FFEDD5)', border: '1px solid #FBBF24', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#92400E', fontWeight: 600, marginBottom: 14 }}>
          ⚠️ Water/sewer issues are prioritized. Expected response: 1–2 business days.
        </div>
      )}

      {/* Location */}
      <div style={{ marginBottom: 18 }}>
        <label style={shared.label}>📍 Location</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Enter address or use GPS below"
          style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `2px solid ${colors.grayBorder}`, fontSize: 14, fontFamily: font, color: colors.navy, boxSizing: 'border-box', marginBottom: 8, outline: 'none' }}
        />
        <button onClick={handleLocate} style={{ background: '#EBF4FF', border: '1px solid #BEE3F8', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: colors.blue, cursor: 'pointer', fontFamily: font }}>
          {locating ? '📡 Locating...' : '📡 Use My Location'}
        </button>
      </div>

      {/* Photos */}
      <div style={{ marginBottom: 18 }}>
        <label style={shared.label}>📸 Photos <span style={shared.optional}>(up to 3)</span></label>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple onChange={handlePhotoSelect} style={{ display: 'none' }} />
        <div style={{ display: 'flex', gap: 10 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ width: 72, height: 72, borderRadius: 12, border: '2px solid #C6F6D5', overflow: 'hidden', position: 'relative' }}>
              <img src={p.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -4, right: -4, width: 22, height: 22, borderRadius: 11, background: colors.red, color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
            </div>
          ))}
          {photos.length < 3 && (
            <button onClick={() => fileRef.current?.click()} style={{ width: 72, height: 72, borderRadius: 12, border: '2px dashed #CBD5E0', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'pointer', fontFamily: font }}>
              <span style={{ fontSize: 22, color: colors.grayLight, fontWeight: 300 }}>+</span>
              <span style={{ fontSize: 9, color: colors.grayLight, fontWeight: 600 }}>Add Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 18 }}>
        <label style={shared.label}>✏️ Description <span style={shared.optional}>(optional)</span></label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="e.g., Large pothole near the crosswalk, about 2 feet wide..." style={{ width: '100%', borderRadius: 12, border: `2px solid ${colors.grayBorder}`, padding: '12px 14px', fontSize: 14, fontFamily: font, resize: 'vertical', color: colors.navy, background: '#fff', boxSizing: 'border-box', outline: 'none' }} />
      </div>

      {/* Contact (optional) */}
      <div style={{ marginBottom: 18 }}>
        <label style={shared.label}>📧 Email for updates <span style={shared.optional}>(optional)</span></label>
        <input type="email" placeholder="you@email.com" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `2px solid ${colors.grayBorder}`, fontSize: 14, fontFamily: font, color: colors.navy, boxSizing: 'border-box', outline: 'none' }} />
      </div>

      <button onClick={handleSubmit} disabled={uploading} style={{ ...shared.submitBtn, opacity: uploading ? 0.7 : 1 }}>
        {uploading ? 'Submitting...' : 'Submit Report →'}
      </button>
    </div>
  );
}
