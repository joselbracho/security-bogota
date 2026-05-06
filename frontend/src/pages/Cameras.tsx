import { useState, useEffect } from 'react';
import { cameraService } from '../services/api';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

const Cameras = () => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '', model: '', location: '', latitude: 4.6, longitude: -74.1, status: 'Active', locality: ''
  });

  const fetchCameras = async () => {
    try {
      const res = await cameraService.list({ search, status });
      setCameras(res.data);
    } catch (error) {
      console.error("Error fetching cameras", error);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, [search, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCamera) {
        await cameraService.update(editingCamera.id, formData);
      } else {
        await cameraService.create(formData);
      }
      setIsModalOpen(false);
      setEditingCamera(null);
      setFormData({ id: '', model: '', location: '', latitude: 4.6, longitude: -74.1, status: 'Active', locality: '' });
      fetchCameras();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error saving camera");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta cámara?")) {
      await cameraService.delete(id);
      fetchCameras();
    }
  };

  const openModal = (camera: any = null) => {
    if (camera) {
      setEditingCamera(camera);
      setFormData(camera);
    } else {
      setEditingCamera(null);
      setFormData({ id: '', model: '', location: '', latitude: 4.6, longitude: -74.1, status: 'Active', locality: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Inventario de Cámaras</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          <Plus size={20} />
          <span>Nueva Cámara</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por modelo, ubicación o ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Active">Activa</option>
          <option value="Inactive">Inactiva</option>
          <option value="Maintenance">En Mantenimiento</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm font-semibold border-b border-gray-100">
              <th className="p-4">ID</th>
              <th className="p-4">Modelo</th>
              <th className="p-4">Ubicación / Localidad</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {cameras.map((cam) => (
              <tr key={cam.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 font-mono text-xs font-bold text-blue-600">{cam.id}</td>
                <td className="p-4 font-medium">{cam.model}</td>
                <td className="p-4">
                  <p className="text-sm">{cam.location}</p>
                  <p className="text-xs text-gray-500">{cam.locality}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    cam.status === 'Active' ? 'bg-green-100 text-green-700' :
                    cam.status === 'Inactive' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {cam.status === 'Active' ? 'Activa' : cam.status === 'Inactive' ? 'Inactiva' : 'Mantenimiento'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openModal(cam)} className="p-2 text-gray-400 hover:text-slate-900 transition"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete(cam.id)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingCamera ? 'Editar Cámara' : 'Nueva Cámara'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID (único)</label>
                  <input required disabled={!!editingCamera} type="text" className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})}/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})}/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitud (4.4 - 4.9)</label>
                  <input required type="number" step="0.001" className="w-full px-4 py-2 border rounded-lg" value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitud (-74.3 - -73.9)</label>
                  <input required type="number" step="0.001" className="w-full px-4 py-2 border rounded-lg" value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="Active">Activa</option>
                    <option value="Inactive">Inactiva</option>
                    <option value="Maintenance">En Mantenimiento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.locality} onChange={(e) => setFormData({...formData, locality: e.target.value})}/>
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cameras;
