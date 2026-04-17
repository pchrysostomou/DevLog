import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSkills } from '../hooks/useSkills'
import { useLogs } from '../hooks/useLogs'
import { Plus, Trash2, Edit2, Target } from 'lucide-react'

export default function Skills() {
  const { user } = useAuth()
  const { skills, fetchSkills, addSkill, updateSkill, deleteSkill, loading: skillsLoading } = useSkills(user?.id)
  const { logs, fetchLogs, loading: logsLoading } = useLogs(user?.id)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', target_hours: 10, color: '#6366f1' })

  useEffect(() => {
    if (user) {
      fetchSkills()
      fetchLogs() // Needed to calculate progress
    }
  }, [user, fetchSkills, fetchLogs])

  const handleOpenForm = (skill = null) => {
    if (skill) {
      setEditingId(skill.id)
      setFormData({ name: skill.name, target_hours: skill.target_hours, color: skill.color || '#6366f1' })
    } else {
      setEditingId(null)
      setFormData({ name: '', target_hours: 10, color: '#6366f1' })
    }
    setIsFormOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateSkill(editingId, formData)
    } else {
      await addSkill(formData)
    }
    setIsFormOpen(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(id)
    }
  }

  const getProgress = (skillName, target) => {
    if (!logs) return { hours: 0, percentage: 0 }
    let total = 0
    logs.forEach(log => {
      if (log.tags?.some(tag => tag.toLowerCase() === skillName.toLowerCase())) {
        total += Number(log.hours || 0)
      }
    })
    const percentage = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0
    return { hours: total, percentage }
  }

  const predefinedColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6']

  return (
    <div className="p-4 md:p-8 pb-12 w-full max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] md:w-[300px] h-1 bg-indigo-500/50 blur-[2px]"></div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">Skills & Goals</h1>
          <p className="text-slate-400 mt-2 font-medium text-sm md:text-base">
            Set targets and track your mastery.
          </p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 min-h-[44px]"
          >
            <Plus size={18} /> <span className="hidden md:inline">New Skill</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden animate-fade-in">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>
           <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:items-end">
              <div className="w-full lg:w-1/3">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Skill Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-100 placeholder-slate-600 transition-all shadow-inner min-h-[44px]"
                  placeholder="e.g. React"
                />
              </div>
              <div className="w-full lg:w-1/4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Target Hours</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={formData.target_hours} 
                  onChange={(e) => setFormData({...formData, target_hours: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-100 placeholder-slate-600 transition-all shadow-inner min-h-[44px]"
                />
              </div>
              <div className="w-full lg:w-1/4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Color</label>
                <div className="flex flex-wrap gap-3">
                  {predefinedColors.map(c => (
                    <button 
                      key={c} type="button" 
                      onClick={() => setFormData({...formData, color: c})}
                      className={`w-10 h-10 md:w-8 md:h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'} min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                 <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]">
                   {editingId ? 'Save' : 'Create'}
                 </button>
                 <button type="button" onClick={() => setIsFormOpen(false)} className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 border border-slate-700/50 transition-colors min-h-[44px]">
                   Cancel
                 </button>
              </div>
           </div>
        </form>
      )}

      {skillsLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/30 border border-slate-800/50 rounded-3xl border-dashed">
          <Target size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-slate-300 mb-2">No skills tracked yet</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base px-4">Click "New Skill" to start setting target hours for the technologies you want to learn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => {
            const progress = getProgress(skill.name, skill.target_hours)
            return (
              <div key={skill.id} className="bg-slate-900/50 backdrop-blur-2xl p-6 rounded-3xl border border-slate-700/50 shadow-xl group relative overflow-hidden transition-all hover:border-slate-600/50 flex flex-col justify-between min-h-[180px]">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundColor: skill.color || '#6366f1' }}></div>
                
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-lg shrink-0" style={{ backgroundColor: skill.color || '#6366f1', boxShadow: `0 0 10px ${skill.color}80` }}></div>
                    <h3 className="text-xl font-bold text-white tracking-tight break-all leading-tight">{skill.name}</h3>
                  </div>
                  <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenForm(skill)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">{progress.hours}<span className="text-xs sm:text-sm font-medium text-slate-500 ml-1">/ {skill.target_hours} hrs</span></span>
                    <span className="text-sm font-bold" style={{ color: skill.color || '#6366f1' }}>{progress.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden shadow-inner border border-slate-800/50">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${progress.percentage}%`, backgroundColor: skill.color || '#6366f1' }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
