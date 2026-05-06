import { useState, useEffect } from 'react';
import { ticketService, cameraService } from '../services/api';
import { Plus, Edit2, X, AlertTriangle, Calendar } from 'lucide-react';

const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [cameras, setCameras] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: '', ticket_type: '', priority: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '', camera: '', ticket_type: 'Corrective', description: '', priority: 'Medium', status: 'New'
  });

  const fetchData = async () => {
    try {
      const [ticketsRes, camerasRes] = await Promise.all([
        ticketService.list(filters),
        cameraService.list()
      ]);
      setTickets(ticketsRes.data);
      setCameras(camerasRes.data);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTicket) {
        await ticketService.update(editingTicket.id, { 
            status: formData.status, 
            priority: formData.priority,
            description: formData.description
        });
      } else {
        await ticketService.create(formData);
      }
      setIsModalOpen(false);
      setEditingTicket(null);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error saving ticket");
    }
  };

  const openModal = (ticket: any = null) => {
    if (ticket) {
      setEditingTicket(ticket);
      setFormData({...ticket, camera: ticket.camera});
    } else {
      setEditingTicket(null);
      setFormData({ 
          id: `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, 
          camera: '', ticket_type: 'Corrective', description: '', priority: 'Medium', status: 'New' 
      });
    }
    setIsModalOpen(true);
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
        case 'Critical': return 'text-red-600 bg-red-100';
        case 'High': return 'text-orange-600 bg-orange-100';
        case 'Medium': return 'text-blue-600 bg-blue-100';
        default: return 'text-gray-600 bg-gray-100';
    }
  }

  const translateStatus = (s: string) => {
      switch(s) {
          case 'New': return 'Nuevo';
          case 'In Progress': return 'En curso';
          case 'Resolved': return 'Resuelto';
          default: return s;
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Tickets de Mantenimiento</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          <Plus size={20} />
          <span>Nuevo Ticket</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">Todos los estados</option>
          <option value="New">Nuevo</option>
          <option value="In Progress">En curso</option>
          <option value="Resolved">Resuelto</option>
        </select>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={filters.ticket_type}
          onChange={(e) => setFilters({...filters, ticket_type: e.target.value})}
        >
          <option value="">Todos los tipos</option>
          <option value="Corrective">Correctivo</option>
          <option value="Preventive">Preventivo</option>
        </select>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="">Todas las prioridades</option>
          <option value="Critical">Crítica</option>
          <option value="High">Alta</option>
          <option value="Medium">Media</option>
          <option value="Low">Baja</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((tkt) => (
          <div key={tkt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600">{tkt.id}</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getPriorityColor(tkt.priority)}`}>
                {tkt.priority === 'Critical' ? 'Crítica' : tkt.priority === 'High' ? 'Alta' : tkt.priority === 'Medium' ? 'Media' : 'Baja'}
              </span>
            </div>
            <div className="p-4 flex-1 space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <AlertTriangle size={16} />
                <span>{tkt.camera}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{tkt.description}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Calendar size={14} />
                  <span>{new Date(tkt.created_at).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  tkt.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                  tkt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {translateStatus(tkt.status)}
                </span>
              </div>
            </div>
            {tkt.status !== 'Resolved' && (
              <button onClick={() => openModal(tkt)} className="w-full py-3 bg-gray-50 text-slate-900 text-sm font-bold border-t border-gray-100 hover:bg-slate-900 hover:text-white transition flex items-center justify-center space-x-2">
                <Edit2 size={14} />
                <span>Gestionar Ticket</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingTicket ? 'Gestionar Ticket' : 'Nuevo Ticket'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingTicket && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cámara</label>
                    <select required className="w-full px-4 py-2 border rounded-lg" value={formData.camera} onChange={(e) => setFormData({...formData, camera: e.target.value})}>
                      <option value="">Seleccionar cámara...</option>
                      {cameras.map(c => <option key={c.id} value={c.id}>{c.id} - {c.model}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select className="w-full px-4 py-2 border rounded-lg" value={formData.ticket_type} onChange={(e) => setFormData({...formData, ticket_type: e.target.value})}>
                      <option value="Corrective">Correctivo</option>
                      <option value="Preventive">Preventivo</option>
                    </select>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select className="w-full px-4 py-2 border rounded-lg" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                  <option value="Critical">Crítica</option>
                </select>
              </div>

              {editingTicket && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full px-4 py-2 border rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    {editingTicket.status === 'New' && <option value="New">Nuevo</option>}
                    {editingTicket.status === 'New' && <option value="In Progress">En curso</option>}
                    {editingTicket.status === 'In Progress' && <option value="In Progress">En curso</option>}
                    <option value="Resolved">Resuelto</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea required rows={3} className="w-full px-4 py-2 border rounded-lg" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">{editingTicket ? 'Actualizar' : 'Crear Ticket'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
