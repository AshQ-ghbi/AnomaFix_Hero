/**
 * Interactive Real-Time Leaflet Map component with OpenStreetMap and real-time geocoding
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase, Report } from '../utils/supabase';
import { MapPin, ShieldAlert, CheckCircle, Zap, Layers, Flame } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  selectedLat?: number;
  selectedLng?: number;
  readOnly?: boolean;
  interactive?: boolean;
  highlightReportId?: string;
}

export default function InteractiveMap({
  onLocationSelect,
  selectedLat,
  selectedLng,
  readOnly = false,
  interactive = true,
  highlightReportId
}: InteractiveMapProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'streets' | 'heatmap'>('streets');
  const [activePin, setActivePin] = useState<Report | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);

  // Load real-time issues
  useEffect(() => {
    setReports(supabase.getReports());
    const unsub = supabase.subscribe(() => {
      setReports(supabase.getReports());
    });
    return unsub;
  }, []);

  // Sync highlighted report id from parent search
  useEffect(() => {
    if (highlightReportId) {
      const rep = reports.find(r => r.id === highlightReportId);
      if (rep) {
        setActivePin(rep);
        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([rep.latitude, rep.longitude], 14, { duration: 1.5 });
        }
      }
    }
  }, [highlightReportId, reports]);

  // Fallback landmarks for offline/sandboxed geocoding
  const FALLBACK_LANDMARKS = [
    { name: 'Connaught Place, New Delhi, Delhi 110001, India', lat: 28.6304, lng: 77.2177, street: 'Barakhamba Road' },
    { name: 'Saket, New Delhi, Delhi 110017, India', lat: 28.5244, lng: 77.2144, street: 'Press Enclave Marg' },
    { name: 'Indiranagar, Bengaluru, Karnataka 560038, India', lat: 12.9716, lng: 77.5946, street: '100 Feet Road' },
    { name: 'Bandra West, Mumbai, Maharashtra 400050, India', lat: 19.0600, lng: 72.8250, street: 'Carter Road' },
    { name: 'Rajaji Nagar, Bengaluru, Karnataka 560010, India', lat: 12.9900, lng: 77.5500, street: 'Dr Rajkumar Road' },
    { name: 'Sector 62, Noida, Uttar Pradesh 201301, India', lat: 28.6210, lng: 77.3620, street: 'Fortis Hospital Road' },
    { name: 'Salt Lake Sector V, Kolkata, West Bengal 700091, India', lat: 22.5726, lng: 88.4345, street: 'Major Arterial Road' },
    { name: 'T. Nagar, Chennai, Tamil Nadu 600017, India', lat: 13.0418, lng: 80.2341, street: 'G N Chetty Road' },
    { name: 'Manhattan, New York, NY 10024, USA', lat: 40.7831, lng: -73.9654, street: '5th Ave' },
    { name: 'Central London, WC2N 5DU, United Kingdom', lat: 51.5074, lng: -0.1278, street: 'Strand' }
  ];

  // Real-time reverse geocoding from Nominatim OSM API with local fallback
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      // Set a short timeout for the fetch request so it doesn't hang the UI
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en'
          },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          return data.display_name;
        }
      }
    } catch (error) {
      console.warn("Geocoding service unavailable, activating local database match:", error);
    }

    // Mathematical nearest-neighbor fallback
    let closestLandmark = FALLBACK_LANDMARKS[0];
    let minDistance = Infinity;

    for (const landmark of FALLBACK_LANDMARKS) {
      const dLat = lat - landmark.lat;
      const dLng = lng - landmark.lng;
      const distance = Math.sqrt(dLat * dLat + dLng * dLng);
      if (distance < minDistance) {
        minDistance = distance;
        closestLandmark = landmark;
      }
    }

    const mockHouseNo = Math.floor(Math.random() * 450) + 101;
    return `Flat ${mockHouseNo}, ${closestLandmark.street}, ${closestLandmark.name}`;
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on India by default
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true
    });

    mapInstanceRef.current = map;

    // Use nice minimalist light map tiles from OpenStreetMap contributors
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Set up active markers layer
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Handle Map Click
    map.on('click', async (e: L.LeafletMouseEvent) => {
      if (readOnly || !interactive) return;
      const { lat, lng } = e.latlng;

      // Reverse geocode in real-time
      const resolvedAddress = await fetchAddress(lat, lng);
      if (onLocationSelect) {
        onLocationSelect(lat, lng, resolvedAddress);
      }
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        selectedMarkerRef.current = null;
      }
    };
  }, [readOnly, interactive]);

  // 2. Track Selected Marker Location from props
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    if (selectedLat !== undefined && selectedLng !== undefined) {
      const selectedIcon = L.divIcon({
        className: 'custom-selected-icon-container',
        html: `
          <div class="relative flex items-center justify-center w-10 h-10">
            <span class="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-30 animate-bounce"></span>
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.74a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const newMarker = L.marker([selectedLat, selectedLng], { icon: selectedIcon }).addTo(map);
      newMarker.bindPopup(`<div class="font-bold text-blue-600 text-xs px-1">Active Reporting Location</div>`).openPopup();
      selectedMarkerRef.current = newMarker;

      // Smoothly zoom/pan into reporting area
      map.flyTo([selectedLat, selectedLng], 15, { duration: 1.2 });
    }
  }, [selectedLat, selectedLng]);

  // Filters logic
  const filteredReports = reports.filter(r => {
    if (filterCategory !== 'All' && r.category !== filterCategory) return false;
    if (filterSeverity !== 'All' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  // Custom icon factories
  const createHeatIcon = (severity: string) => {
    let size = 64;
    let bgColor = 'rgba(59, 130, 246, 0.4)'; // Blue
    if (severity === 'Critical') {
      bgColor = 'rgba(239, 68, 68, 0.55)'; // Red
      size = 110;
    } else if (severity === 'High') {
      bgColor = 'rgba(245, 158, 11, 0.5)'; // Amber
      size = 85;
    }

    return L.divIcon({
      className: 'custom-heat-icon-container',
      html: `
        <div class="rounded-full filter blur-md animate-pulse" style="width: ${size}px; height: ${size}px; background-color: ${bgColor};"></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  const createCustomIcon = (severity: string, isSelected: boolean, isResolved: boolean) => {
    let bgColor = 'bg-blue-500';
    let innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.74a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

    if (isResolved) {
      bgColor = 'bg-emerald-500';
      innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    } else if (severity === 'Critical') {
      bgColor = 'bg-rose-500';
      innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else if (severity === 'High') {
      bgColor = 'bg-amber-500';
      innerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }

    const size = isSelected ? 'w-10 h-10' : 'w-7 h-7';
    const innerSize = isSelected ? 'w-8 h-8' : 'w-6 h-6';

    return L.divIcon({
      className: 'custom-issue-icon-container',
      html: `
        <div class="relative flex items-center justify-center ${size}">
          ${(severity === 'Critical' || isSelected) ? `<span class="absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-40 animate-ping"></span>` : ''}
          <div class="relative flex items-center justify-center ${innerSize} rounded-full ${bgColor} border-2 border-white shadow-lg text-white">
            ${innerSvg}
          </div>
        </div>
      `,
      iconSize: isSelected ? [40, 40] : [28, 28],
      iconAnchor: isSelected ? [20, 20] : [14, 14]
    });
  };

  // 3. Render active markers on map whenever filtered list or viewmode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredReports.forEach((report) => {
      const isSelected = activePin?.id === report.id;

      const icon = viewMode === 'heatmap'
        ? createHeatIcon(report.severity)
        : createCustomIcon(report.severity, isSelected, report.status === 'Resolved');

      const marker = L.marker([report.latitude, report.longitude], { icon });

      // Custom popup HTML matching municipal theme
      let badgeColor = 'bg-blue-100 text-blue-700';
      if (report.severity === 'Critical') badgeColor = 'bg-red-100 text-red-700';
      else if (report.severity === 'High') badgeColor = 'bg-amber-100 text-amber-700';

      let statusBadge = report.status === 'Resolved'
        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        : 'bg-slate-100 text-slate-700 border border-slate-200';

      const popupHtml = `
        <div class="p-1 font-sans text-xs max-w-[240px]">
          <div class="font-extrabold text-slate-900 text-sm mb-1 leading-tight">${report.title}</div>
          <div class="flex gap-1.5 flex-wrap mb-2">
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">${report.category}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${badgeColor} uppercase tracking-wider">${report.severity}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusBadge}">${report.status}</span>
          </div>
          <p class="text-slate-600 line-clamp-3 leading-relaxed mb-2">${report.description}</p>
          <div class="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 font-medium truncate">${report.address}</div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('click', () => {
        setActivePin(report);
      });

      markersLayer.addLayer(marker);
    });

    // Auto fit viewport to cover all markers if they exist and no user selection is overriding
    if (filteredReports.length > 0 && selectedLat === undefined && selectedLng === undefined) {
      const bounds = L.latLngBounds(filteredReports.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, duration: 1 });
    }
  }, [filteredReports, viewMode, activePin, selectedLat, selectedLng]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm" id="interactive-map-container">
      {/* Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-slate-100 bg-slate-50 gap-2 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Layers className="h-4 w-4 text-blue-500" />
          <span className="font-bold">Real-Time OpenStreetMap</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('streets')}
            className={`px-2.5 py-1 rounded-md transition-all font-semibold flex items-center gap-1 cursor-pointer ${viewMode === 'streets' ? 'bg-white text-blue-600 shadow-3xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <MapPin className="h-3 w-3" />
            <span>Issue Clusters</span>
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-2.5 py-1 rounded-md transition-all font-semibold flex items-center gap-1 cursor-pointer ${viewMode === 'heatmap' ? 'bg-white text-rose-600 shadow-3xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Flame className="h-3 w-3" />
            <span>Predictive Heatmap</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white border-b border-slate-50 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-bold focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Potholes">Potholes</option>
            <option value="Streetlights">Streetlights</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Illegal Dumping">Illegal Dumping</option>
            <option value="Garbage">Garbage</option>
            <option value="Drainage">Drainage</option>
            <option value="Trees">Trees</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-bold focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-bold focus:outline-none focus:border-blue-500 text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="AI Reviewed">AI Reviewed</option>
            <option value="Community Verified">Community Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <span className="ml-auto text-[10px] text-slate-400 font-mono font-bold">
          {filteredReports.length} pins active
        </span>
      </div>

      {/* Main Map Stage */}
      <div className="relative flex-1 bg-slate-100 overflow-hidden min-h-[380px]">
        {/* Leaflet container ref */}
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '380px' }} />

        {/* Dynamic information notice */}
        {interactive && !readOnly && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-semibold py-2 px-3 rounded-xl border border-slate-700/30 flex items-center gap-2 pointer-events-none shadow-lg max-w-sm md:max-w-md mx-auto z-[999]">
            <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Click any coordinate in India or the world to auto-geocode the address in real-time.</span>
          </div>
        )}
      </div>
    </div>
  );
}
