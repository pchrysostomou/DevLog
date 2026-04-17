import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useLogs(userId) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLogs = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', userId)
        .order('log_date', { ascending: false })
      
      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      console.error('Error fetching logs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const addLog = async (logData) => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('logs')
        .insert([{ ...logData, user_id: userId }])
        .select()
        .single()
      
      if (error) throw error
      setLogs(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error adding log:', err)
      setError(err.message)
      return { data: null, error: err }
    }
  }

  const updateLog = async (logId, updates) => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('logs')
        .update(updates)
        .eq('id', logId)
        .select()
        .single()
      
      if (error) throw error
      setLogs(prev => prev.map(log => log.id === logId ? data : log))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating log:', err)
      setError(err.message)
      return { data: null, error: err }
    }
  }

  const deleteLog = async (logId) => {
    try {
      setError(null)
      const { error } = await supabase
        .from('logs')
        .delete()
        .eq('id', logId)
      
      if (error) throw error
      setLogs(prev => prev.filter(log => log.id !== logId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting log:', err)
      setError(err.message)
      return { error: err }
    }
  }

  return {
    logs,
    loading,
    error,
    fetchLogs,
    addLog,
    updateLog,
    deleteLog
  }
}
