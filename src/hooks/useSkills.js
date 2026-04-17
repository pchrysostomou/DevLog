import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function useSkills(userId) {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSkills = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast.error('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const addSkill = async (skillData) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([
          {
            user_id: userId,
            ...skillData
          }
        ])
        .select()

      if (error) throw error
      setSkills(prev => [data[0], ...prev])
      toast.success('Skill added successfully')
      return data[0]
    } catch (error) {
      console.error('Error adding skill:', error)
      toast.error('Failed to add skill')
      return null
    }
  }

  const updateSkill = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()

      if (error) throw error
      setSkills(prev => prev.map(s => s.id === id ? data[0] : s))
      toast.success('Skill updated successfully')
      return data[0]
    } catch (error) {
      console.error('Error updating skill:', error)
      toast.error('Failed to update skill')
      return null
    }
  }

  const deleteSkill = async (id) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
      setSkills(prev => prev.filter(s => s.id !== id))
      toast.success('Skill deleted')
      return true
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Failed to delete skill')
      return false
    }
  }

  return {
    skills,
    loading,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill
  }
}
