import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import LogForm from '../components/logs/LogForm'
import LogList from '../components/logs/LogList'
import { useLogs } from '../hooks/useLogs'
import { useAuth } from '../hooks/useAuth'
import { useSkills } from '../hooks/useSkills'

export default function Logs() {
  const { user } = useAuth()
  const { logs, loading, fetchLogs, addLog, updateLog, deleteLog } = useLogs(user?.id)
  const { skills, fetchSkills, addSkill } = useSkills(user?.id)
  
  const [editingLog, setEditingLog] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchLogs()
      fetchSkills()
    }
  }, [user, fetchLogs, fetchSkills])

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    let err
    if (editingLog) {
      const { error } = await updateLog(editingLog.id, data)
      err = error
      if (!error) {
        toast.success('Log updated successfully!')
        setEditingLog(null)
      }
    } else {
      const { error } = await addLog(data)
      err = error
      if (!error) {
        toast.success('Log added successfully!')
      }
    }
    
    if (err) {
      toast.error(err.message || 'Failed to save log')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (logId) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      const { error } = await deleteLog(logId)
      if (error) {
        toast.error('Failed to delete log')
      } else {
        toast.success('Log deleted')
        if (editingLog?.id === logId) {
          setEditingLog(null)
        }
      }
    }
  }

  return (
    <div className="p-4 md:p-8 pb-12 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-fade-in">
        
        {/* Left Column: Form */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-indigo-500/50 blur-[2px]"></div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {editingLog ? 'Edit Log' : 'New Log'}
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Record what you learned today.
            </p>
          </div>
          <LogForm 
            onSubmit={handleFormSubmit} 
            initialData={editingLog} 
            isSubmitting={isSubmitting}
            availableSkills={skills}
            onAddSkill={addSkill}
          />
          {editingLog && (
            <div className="flex justify-end">
              <button 
                onClick={() => setEditingLog(null)}
                className="text-sm text-slate-400 hover:text-red-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700/50"
              >
                Cancel Editing
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Log List */}
        <div className="w-full lg:w-7/12 space-y-8">
          <div className="flex justify-between items-end pb-4 border-b-2 border-slate-800/80">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your History</h2>
            <span className="text-sm font-medium text-slate-400 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/50">{logs.length} entries</span>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-700"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 rounded bg-slate-700 col-span-2"></div>
                      <div className="h-2 rounded bg-slate-700 col-span-1"></div>
                    </div>
                    <div className="h-2 rounded bg-slate-700"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LogList 
              logs={logs} 
              onEdit={(log) => { setEditingLog(log); window.scrollTo({ top: 0, behavior: 'smooth' }) }} 
              onDelete={handleDelete} 
            />
          )}
        </div>
    </div>
  )
}

