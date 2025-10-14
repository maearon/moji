"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Search } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import type { User as UserDTO  } from "@/lib/auth"

export function AddFriendDialog() {
  const { accessToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserDTO[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users)
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSendRequest = async (userId: string) => {
    try {
      const response = await fetch("/api/friends/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ receiverId: userId }),
      })

      if (response.ok) {
        setSearchResults(searchResults.filter((user) => user.id !== userId))
      }
    } catch (error) {
      console.error("[v0] Send request error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>Search for users to send friend requests</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar>
                  <AvatarImage src={user.image || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">@{user.name}</p>
                </div>
                <Button size="sm" onClick={() => handleSendRequest(user.id)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
