import { useEffect, useState } from 'react';
import { db } from '../../database/db';
import type { Specimen } from '../../types/specimen';
import { QRCodeSVG } from 'qrcode.react';
import './SpecimenList.css';

export function SpecimenList() {
  const [specimens, setSpecimens] = useState<Specimen[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);

  const loadSpecimens = async () => {
    const allSpecimens = await db.specimens.toArray();
    setSpecimens(allSpecimens.sort((a, b) => 
      b.collectedDate.getTime() - a.collectedDate.getTime()
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      const allSpecimens = await db.specimens.toArray();
      setSpecimens(allSpecimens.sort((a, b) => 
        b.collectedDate.getTime() - a.collectedDate.getTime()
      ));
    };
    fetchData();
  }, []);

  const filteredSpecimens = specimens.filter(s => 
    s.specimenNumber.toLowerCase().includes(filter.toLowerCase()) ||
    s.commonName?.toLowerCase().includes(filter.toLowerCase()) ||
    s.scientificName?.toLowerCase().includes(filter.toLowerCase()) ||
    s.collectedBy.toLowerCase().includes(filter.toLowerCase())
  );

  const deleteSpecimen = async (id: string) => {
    if (confirm('Are you sure you want to delete this specimen?')) {
      await db.specimens.delete(id);
      loadSpecimens();
      if (selectedSpecimen?.id === id) {
        setSelectedSpecimen(null);
      }
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(specimens, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `specimens-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="specimen-list">
      <div className="list-header">
        <h2>Collected Specimens ({specimens.length})</h2>
        <div className="list-controls">
          <input
            type="text"
            placeholder="Search specimens..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          <button onClick={exportData} className="btn-export">
            Export All Data
          </button>
        </div>
      </div>

      <div className="list-content">
        <div className="specimens-grid">
          {filteredSpecimens.map(specimen => (
            <div 
              key={specimen.id} 
              className="specimen-card"
              onClick={() => setSelectedSpecimen(specimen)}
            >
              <div className="card-header">
                <h3>{specimen.specimenNumber}</h3>
                <span className={`sync-badge ${specimen.syncStatus}`}>
                  {specimen.syncStatus}
                </span>
              </div>
              
              {(specimen.commonName || specimen.scientificName) && (
                <div className="specimen-names">
                  {specimen.commonName && <p className="common-name">{specimen.commonName}</p>}
                  {specimen.scientificName && <p className="scientific-name">{specimen.scientificName}</p>}
                </div>
              )}
              
              <div className="specimen-meta">
                <p>👤 {specimen.collectedBy}</p>
                <p>📅 {new Date(specimen.collectedDate).toLocaleDateString()}</p>
                {specimen.latitude && specimen.longitude && (
                  <p>📍 {specimen.latitude.toFixed(4)}, {specimen.longitude.toFixed(4)}</p>
                )}
              </div>
              
              <button 
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSpecimen(specimen.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
          
          {filteredSpecimens.length === 0 && (
            <div className="empty-state">
              <p>No specimens found</p>
              {filter && <p className="hint">Try adjusting your search filter</p>}
            </div>
          )}
        </div>

        {selectedSpecimen && (
          <div className="detail-panel">
            <div className="detail-header">
              <h3>Specimen Details</h3>
              <button onClick={() => setSelectedSpecimen(null)}>✕</button>
            </div>
            
            <div className="detail-content">
              <div className="detail-qr">
                <QRCodeSVG value={selectedSpecimen.specimenNumber} size={150} />
              </div>
              
              <div className="detail-section">
                <h4>Identification</h4>
                <p><strong>Specimen #:</strong> {selectedSpecimen.specimenNumber}</p>
                {selectedSpecimen.commonName && <p><strong>Common Name:</strong> {selectedSpecimen.commonName}</p>}
                {selectedSpecimen.scientificName && <p><strong>Scientific Name:</strong> {selectedSpecimen.scientificName}</p>}
              </div>

              <div className="detail-section">
                <h4>Collection Info</h4>
                <p><strong>Collected By:</strong> {selectedSpecimen.collectedBy}</p>
                <p><strong>Date:</strong> {new Date(selectedSpecimen.collectedDate).toLocaleString()}</p>
              </div>

              {(selectedSpecimen.latitude || selectedSpecimen.longitude) && (
                <div className="detail-section">
                  <h4>Location</h4>
                  {selectedSpecimen.latitude && <p><strong>Latitude:</strong> {selectedSpecimen.latitude}</p>}
                  {selectedSpecimen.longitude && <p><strong>Longitude:</strong> {selectedSpecimen.longitude}</p>}
                  {selectedSpecimen.altitude && <p><strong>Altitude:</strong> {selectedSpecimen.altitude}m</p>}
                  {selectedSpecimen.locationDescription && <p><strong>Description:</strong> {selectedSpecimen.locationDescription}</p>}
                </div>
              )}

              {(selectedSpecimen.habitat || selectedSpecimen.soilType || selectedSpecimen.slope || selectedSpecimen.aspect) && (
                <div className="detail-section">
                  <h4>Environment</h4>
                  {selectedSpecimen.habitat && <p><strong>Habitat:</strong> {selectedSpecimen.habitat}</p>}
                  {selectedSpecimen.soilType && <p><strong>Soil Type:</strong> {selectedSpecimen.soilType}</p>}
                  {selectedSpecimen.slope && <p><strong>Slope:</strong> {selectedSpecimen.slope}</p>}
                  {selectedSpecimen.aspect && <p><strong>Aspect:</strong> {selectedSpecimen.aspect}</p>}
                </div>
              )}

              {(selectedSpecimen.height || selectedSpecimen.diameter) && (
                <div className="detail-section">
                  <h4>Measurements</h4>
                  {selectedSpecimen.height && <p><strong>Height:</strong> {selectedSpecimen.height}m</p>}
                  {selectedSpecimen.diameter && <p><strong>Diameter:</strong> {selectedSpecimen.diameter}cm</p>}
                </div>
              )}

              {selectedSpecimen.notes && (
                <div className="detail-section">
                  <h4>Notes</h4>
                  <p>{selectedSpecimen.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
