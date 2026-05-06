import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { dashboardService, cameraService } from '../services/api';
import { Camera, Ticket, Clock, AlertCircle, Play, X, Activity } from 'lucide-react';
import L from 'leaflet';

const COLORS = {
  'Active': '#22c55e',
  'Inactive': '#ef4444',
  'Maintenance': '#f59e0b'
};

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedStream, setSelectedStream] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, camerasRes] = await Promise.all([
          dashboardService.getStats(),
          cameraService.list()
        ]);
        setStats(statsRes.data);
        setCameras(camerasRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-full text-gray-500 font-medium italic">Conectando con el centro de mando...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Control Bogotá</h1>
        <div className="flex items-center space-x-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <Activity size={14} className="animate-pulse" />
          <span>SISTEMA EN LÍNEA</span>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Camera size={24}/></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cámaras Activas</p>
            <p className="text-2xl font-black text-slate-800">{stats.active_cameras}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Ticket size={24}/></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tickets Abiertos</p>
            <p className="text-2xl font-black text-slate-800">{stats.open_tickets}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24}/></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resolución Avg</p>
            <p className="text-2xl font-black text-slate-800">{stats.avg_resolution_time?.toFixed(1) || 'N/A'} <span className="text-xs font-normal text-slate-400">días</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={24}/></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Críticos/Altos</p>
            <p className="text-2xl font-black text-slate-800">{stats.critical_high_open_tickets_percentage.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-[600px] flex flex-col">
          <div className="p-4 flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-800">Mapa Geo-referenciado</h2>
             <div className="flex space-x-4 text-[10px] font-black uppercase tracking-tighter">
                <div className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span>Activa</span></div>
                <div className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span>Mantto</span></div>
                <div className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><span>Inactiva</span></div>
             </div>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 relative group">
            <MapContainer center={[4.65, -74.08]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              {cameras.map((cam) => (
                <Marker 
                  key={cam.id} 
                  position={[cam.latitude, cam.longitude]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: ${COLORS[cam.status as keyof typeof COLORS]}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                  })}
                >
                  <Popup className="custom-popup">
                    <div className="w-48 p-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">{cam.id}</span>
                        <span className={`w-2 h-2 rounded-full`} style={{backgroundColor: COLORS[cam.status as keyof typeof COLORS]}}></span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 mb-0.5">{cam.model}</p>
                      <p className="text-xs text-slate-500 mb-3">{cam.location}</p>
                      
                      {cam.status === 'Active' ? (
                        <button 
                          onClick={() => setSelectedStream(cam)}
                          className="w-full bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-slate-800 transition flex items-center justify-center space-x-2"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>VISUALIZAR STREAM</span>
                        </button>
                      ) : (
                        <div className="text-center py-2 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 uppercase">
                           Stream No Disponible
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Side Charts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Estado de Inventario</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.status_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="count"
                    nameKey="status"
                    stroke="none"
                  >
                    {stats.status_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
               {stats.status_distribution.map((entry: any) => (
                 <div key={entry.status} className="text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">{entry.status === 'Active' ? 'Act' : entry.status === 'Inactive' ? 'Ina' : 'Mnt'}</p>
                   <p className="text-sm font-black text-slate-800">{entry.count}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Tickets por Localidad</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.locality_stats} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="locality" type="category" width={80} fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="corrective" name="Correctivo" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={8} />
                  <Bar dataKey="preventive" name="Preventivo" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* RTSP Stream Modal Simulation */}
      {selectedStream && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-800">
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                <div>
                  <h2 className="text-white font-black leading-none uppercase tracking-tighter">LIVE FEED: {selectedStream.id}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedStream.model} • {selectedStream.location}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStream(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
              >
                <X size={24}/>
              </button>
            </div>
            
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {/* Simulation of a Live Stream */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              
              <div className="text-center space-y-4">
                 <div className="flex justify-center"><Activity size={48} className="text-blue-500 animate-pulse" /></div>
                 <div className="space-y-1">
                    <p className="text-blue-400 font-mono text-sm">CONNECTING TO RTSP STREAM...</p>
                    <p className="text-slate-600 font-mono text-[10px]">{selectedStream.rtsp_url}</p>
                 </div>
              </div>

              {/* HUD Elements */}
              <div className="absolute top-4 left-4 font-mono text-[10px] text-green-500 font-bold space-y-1">
                 <p>REC [●] {new Date().toLocaleTimeString()}</p>
                 <p>CAM_LAT: {selectedStream.latitude.toFixed(4)}</p>
                 <p>CAM_LNG: {selectedStream.longitude.toFixed(4)}</p>
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-slate-500 font-bold">
                 BOGOTÁ_SURVEILLANCE_NET_v4.2
              </div>
            </div>
            
            <div className="p-4 bg-slate-950 flex items-center justify-between text-slate-400">
               <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div><span>SIGNAL STRENGTH: 98%</span></div>
                  <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div><span>ENC: AES-256</span></div>
               </div>
               <div className="text-[10px] font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                  PROTOCOL: RTSP/UDP
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
