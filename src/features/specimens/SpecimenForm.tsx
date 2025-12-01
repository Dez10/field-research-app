import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Specimen } from '../../types/specimen';
import { generateSpecimenId } from '../../utils/idGenerator';
import { validateCoordinates } from '../../utils/validators';
import { useGeolocation } from '../../hooks/useGeolocation';
import { db } from '../../database/db';
import './SpecimenForm.css';

export function SpecimenForm() {
  const geoLocation = useGeolocation();
  const [specimen, setSpecimen] = useState<Partial<Specimen>>({
    id: generateSpecimenId(),
    specimenNumber: generateSpecimenId(),
    collectedBy: '',
    collectedDate: new Date(),
    syncStatus: 'pending',
  });
  
  const [showQR, setShowQR] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Specimen, value: string | number) => {
    setSpecimen(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const useCurrentLocation = () => {
    if (geoLocation.latitude && geoLocation.longitude) {
      setSpecimen(prev => ({
        ...prev,
        latitude: geoLocation.latitude ?? undefined,
        longitude: geoLocation.longitude ?? undefined,
        altitude: geoLocation.altitude ?? undefined,
      }));
    }
  };

  const generateNewId = () => {
    const newId = generateSpecimenId();
    setSpecimen(prev => ({ ...prev, id: newId, specimenNumber: newId }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!specimen.collectedBy?.trim()) {
      newErrors.collectedBy = 'Collector name is required';
    }
    
    const coordValidation = validateCoordinates(specimen.latitude, specimen.longitude);
    if (!coordValidation.valid) {
      newErrors.coordinates = coordValidation.message || 'Invalid coordinates';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const fullSpecimen: Specimen = {
        ...specimen,
        collectedBy: specimen.collectedBy || '',
        collectedDate: specimen.collectedDate || new Date(),
        modifiedDate: new Date(),
        syncStatus: 'pending',
      } as Specimen;

      await db.specimens.add(fullSpecimen);
      
      alert(`Specimen ${specimen.specimenNumber} saved successfully!`);
      
      // Reset form with new ID
      setSpecimen({
        id: generateSpecimenId(),
        specimenNumber: generateSpecimenId(),
        collectedBy: specimen.collectedBy, // Keep collector name
        collectedDate: new Date(),
        syncStatus: 'pending',
      });
      setShowQR(false);
    } catch (error) {
      alert('Error saving specimen: ' + (error as Error).message);
    }
  };

  return (
    <div className="specimen-form">
      <h2>New Specimen Collection</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Specimen ID Section */}
        <div className="form-section">
          <h3>Specimen Identification</h3>
          
          <div className="form-group">
            <label>Specimen Number</label>
            <div className="id-controls">
              <input
                type="text"
                value={specimen.specimenNumber || ''}
                onChange={(e) => handleInputChange('specimenNumber', e.target.value)}
                readOnly
              />
              <button type="button" onClick={generateNewId}>
                Generate New ID
              </button>
              <button type="button" onClick={() => setShowQR(!showQR)}>
                {showQR ? 'Hide' : 'Show'} QR Code
              </button>
            </div>
          </div>

          {showQR && specimen.specimenNumber && (
            <div className="qr-code-container">
              <QRCodeSVG value={specimen.specimenNumber} size={200} />
              <p>Scan to access specimen {specimen.specimenNumber}</p>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Common Name</label>
            <input
              type="text"
              value={specimen.commonName || ''}
              onChange={(e) => handleInputChange('commonName', e.target.value)}
              placeholder="e.g., Douglas Fir"
            />
          </div>

          <div className="form-group">
            <label>Scientific Name</label>
            <input
              type="text"
              value={specimen.scientificName || ''}
              onChange={(e) => handleInputChange('scientificName', e.target.value)}
              placeholder="e.g., Pseudotsuga menziesii"
            />
          </div>

          <div className="form-group">
            <label>Collected By *</label>
            <input
              type="text"
              value={specimen.collectedBy || ''}
              onChange={(e) => handleInputChange('collectedBy', e.target.value)}
              placeholder="Your name"
              required
            />
            {errors.collectedBy && <span className="error">{errors.collectedBy}</span>}
          </div>
        </div>

        {/* Location Data */}
        <div className="form-section">
          <h3>Location Data</h3>
          
          <div className="location-controls">
            <button type="button" onClick={useCurrentLocation} disabled={!geoLocation.latitude}>
              📍 Use Current Location
            </button>
            {geoLocation.loading && <span>Getting location...</span>}
            {geoLocation.error && <span className="error">{geoLocation.error}</span>}
            {geoLocation.accuracy && <span className="accuracy">±{geoLocation.accuracy.toFixed(0)}m</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                value={specimen.latitude || ''}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                placeholder="e.g., 40.7128"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                value={specimen.longitude || ''}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>

          {errors.coordinates && <span className="error">{errors.coordinates}</span>}

          <div className="form-group">
            <label>Location Description</label>
            <input
              type="text"
              value={specimen.locationDescription || ''}
              onChange={(e) => handleInputChange('locationDescription', e.target.value)}
              placeholder="e.g., Near creek, 50m from trail marker"
            />
          </div>
        </div>

        {/* Environmental Data */}
        <div className="form-section">
          <h3>Environmental Data</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Habitat</label>
              <input
                type="text"
                value={specimen.habitat || ''}
                onChange={(e) => handleInputChange('habitat', e.target.value)}
                placeholder="e.g., Mixed conifer forest"
              />
            </div>

            <div className="form-group">
              <label>Soil Type</label>
              <input
                type="text"
                value={specimen.soilType || ''}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                placeholder="e.g., Sandy loam"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Slope</label>
              <input
                type="text"
                value={specimen.slope || ''}
                onChange={(e) => handleInputChange('slope', e.target.value)}
                placeholder="e.g., Moderate, 15°"
              />
            </div>

            <div className="form-group">
              <label>Aspect</label>
              <select
                value={specimen.aspect || ''}
                onChange={(e) => handleInputChange('aspect', e.target.value)}
              >
                <option value="">Select aspect</option>
                <option value="N">North</option>
                <option value="NE">Northeast</option>
                <option value="E">East</option>
                <option value="SE">Southeast</option>
                <option value="S">South</option>
                <option value="SW">Southwest</option>
                <option value="W">West</option>
                <option value="NW">Northwest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="form-section">
          <h3>Measurements</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Height (m)</label>
              <input
                type="number"
                step="0.01"
                value={specimen.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Diameter (cm)</label>
              <input
                type="number"
                step="0.1"
                value={specimen.diameter || ''}
                onChange={(e) => handleInputChange('diameter', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <h3>Notes</h3>
          
          <div className="form-group">
            <label>Field Notes</label>
            <textarea
              value={specimen.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional observations, condition, associated species, etc."
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Specimen
          </button>
          <button type="button" className="btn-secondary" onClick={() => {
            if (confirm('Clear form and start new specimen?')) {
              setSpecimen({
                id: generateSpecimenId(),
                specimenNumber: generateSpecimenId(),
                collectedBy: specimen.collectedBy,
                collectedDate: new Date(),
                syncStatus: 'pending',
              });
              setShowQR(false);
            }
          }}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
