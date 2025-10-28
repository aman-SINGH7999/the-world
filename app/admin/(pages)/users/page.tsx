"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast"
import axios from "axios"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {

    const loadUsers = async () => {
      setLoading(false)
      try{
        const { data } = await axios.get('/api/admin/users')
        setUsers(data.users)
      }catch(err){
        console.log("Error in getting users",err)
      }finally{
        setLoading(false)
      }
    }

    loadUsers()
  }, [currentUser])

  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log(userId,newRole)
    addToast("Currently not implemented", "success")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Users</h1>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No users found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border border-border rounded-md text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
