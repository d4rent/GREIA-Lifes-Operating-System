'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Search, 
  MapPin, 
  Building2, 
  MessageCircle,
  UserPlus,
  Calendar,
  Briefcase,
  Network,
  Target,
  CheckSquare,
  Bell,
  Settings,
  Plus,
  Filter,
  TrendingUp,
  Globe
} from "lucide-react"
import Link from "next/link"

export default function Connect() {
  const [activeTab, setActiveTab] = useState('network')
  const [searchQuery, setSearchQuery] = useState('')

  const connections = [
    {
      id: 1,
      name: "Sarah O'Connor",
      title: "Real Estate Agent",
      company: "Dublin Properties Ltd",
      location: "Dublin, Ireland",
      avatar: "SO",
      mutualConnections: 12,
      industry: "Real Estate",
      verified: true,
      lastActive: "2 hours ago",
      connectionType: "Professional"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Mortgage Broker",
      company: "Chen Financial Solutions",
      location: "London, UK",
      avatar: "MC",
      mutualConnections: 8,
      industry: "Finance",
      verified: true,
      lastActive: "1 day ago",
      connectionType: "Business Partner"
    },
    {
      id: 3,
      name: "Emma Thompson",
      title: "Interior Designer",
      company: "Thompson Design Studio",
      location: "Barcelona, Spain",
      avatar: "ET",
      mutualConnections: 15,
      industry: "Design",
      verified: true,
      lastActive: "3 hours ago",
      connectionType: "Collaborator"
    }
  ]

  const organizations = [
    {
      id: 1,
      name: "European Property Network",
      type: "Professional Association",
      members: 1247,
      location: "Europe-wide",
      description: "Connecting property professionals across Europe for collaboration and knowledge sharing.",
      category: "Real Estate",
      joined: true,
      activity: "High"
    },
    {
      id: 2,
      name: "Dublin Business Hub",
      type: "Local Business Group",
      members: 456,
      location: "Dublin, Ireland",
      description: "Local business networking group for Dublin entrepreneurs and professionals.",
      category: "Business",
      joined: false,
      activity: "Medium"
    },
    {
      id: 3,
      name: "Tech Innovators Collective",
      type: "Industry Group",
      members: 892,
      location: "Global",
      description: "A community of technology innovators and entrepreneurs sharing insights and opportunities.",
      category: "Technology",
      joined: true,
      activity: "Very High"
    }
  ]

  const tasks = [
    {
      id: 1,
      title: "Follow up with Sarah about property listing",
      dueDate: "2024-09-01",
      priority: "High",
      category: "Follow-up",
      completed: false,
      assignedTo: "Sarah O'Connor"
    },
    {
      id: 2,
      title: "Schedule meeting with design team",
      dueDate: "2024-09-03",
      priority: "Medium",
      category: "Meeting",
      completed: false,
      assignedTo: "Emma Thompson"
    },
    {
      id: 3,
      title: "Review mortgage application documents",
      dueDate: "2024-08-30",
      priority: "High",
      category: "Review",
      completed: true,
      assignedTo: "Michael Chen"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "connection",
      user: "John Smith",
      action: "connected with you",
      time: "2 hours ago",
      avatar: "JS"
    },
    {
      id: 2,
      type: "post",
      user: "Emma Thompson",
      action: "shared a new design project",
      time: "4 hours ago",
      avatar: "ET"
    },
    {
      id: 3,
      type: "group",
      user: "Dublin Business Hub",
      action: "posted an event",
      time: "6 hours ago",
      avatar: "DB"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-semibold">greia</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">Properties</Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="/leisure" className="text-gray-600 hover:text-gray-900">Leisure</Link>
              <Link href="/connect" className="text-blue-600 font-medium">Connect</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect & Collaborate</h1>
            <p className="text-xl opacity-90">Build your professional network and manage your business relationships</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search people, organizations, or groups..."
                  className="pl-10 border-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="network" className="flex items-center">
                <Network className="w-4 h-4 mr-2" />
                My Network
              </TabsTrigger>
              <TabsTrigger value="organizations" className="flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Organizations
              </TabsTrigger>
              <TabsTrigger value="crm" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                CRM
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                Tasks
              </TabsTrigger>
            </TabsList>

            {/* My Network Tab */}
            <TabsContent value="network" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Professional Network</h2>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Connections
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Connections List */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {connections.map((connection) => (
                      <Card key={connection.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-blue-600 font-semibold">{connection.avatar}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <h3 className="font-semibold">{connection.name}</h3>
                                  {connection.verified && (
                                    <Badge variant="secondary" className="ml-2 text-xs">Verified</Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-1">{connection.title}</p>
                                <p className="text-sm text-gray-500 mb-2">{connection.company}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {connection.location}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="mb-2">{connection.connectionType}</Badge>
                              <p className="text-xs text-gray-500">{connection.mutualConnections} mutual</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-xs text-gray-500">Active {connection.lastActive}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                              <Button size="sm">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Activity Sidebar */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600 font-medium text-xs">{activity.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Organizations & Groups</h2>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <Card key={org.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <Badge variant={org.joined ? "default" : "outline"}>
                          {org.joined ? "Joined" : "Available"}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{org.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{org.type}</p>
                      <p className="text-sm text-gray-600 mb-4">{org.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {org.members} members
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          {org.location}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {org.activity} activity
                        </div>
                      </div>

                      <Button 
                        className={`w-full ${org.joined ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                      >
                        {org.joined ? 'View Group' : 'Join Group'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* CRM Tab */}
            <TabsContent value="crm" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Customer Relationship Management</h2>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">127</div>
                    <p className="text-gray-600">Total Contacts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">23</div>
                    <p className="text-gray-600">Active Deals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">€45K</div>
                    <p className="text-gray-600">Pipeline Value</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                    <p className="text-gray-600">Close Rate</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Interactions</CardTitle>
                  <CardDescription>Track your customer communications and follow-ups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {connections.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">{contact.avatar}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-gray-500">{contact.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Property Inquiry</Badge>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Follow Up
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Task Management</h2>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                    <p className="text-gray-600">Open Tasks</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                    <p className="text-gray-600">Completed Today</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">3</div>
                    <p className="text-gray-600">Overdue</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>Manage your to-do list and track progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className={`flex items-center justify-between p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : ''}`}>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            className="mr-3"
                            readOnly
                          />
                          <div>
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Due: {task.dueDate}</span>
                              <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>
                                {task.priority}
                              </Badge>
                              <span>• {task.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
