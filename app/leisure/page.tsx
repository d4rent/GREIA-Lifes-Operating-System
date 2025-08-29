import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectOption } from '../../components/ui/select'

export default function Leisure() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Leisure Activities</h1>
            <div className="flex gap-4">
              <Input 
                type="search" 
                placeholder="Search activities..." 
                className="w-64"
              />
              <Select className="w-48">
                <SelectOption value="">All Categories</SelectOption>
                <SelectOption value="sports">Sports</SelectOption>
                <SelectOption value="culture">Culture</SelectOption>
                <SelectOption value="nature">Nature</SelectOption>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{activity.name}</h3>
                    <Badge>{activity.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{activity.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{activity.location}</span>
                    <span className="font-semibold">{activity.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

const activities = [
  {
    name: "Mountain Biking",
    category: "Sports",
    description: "Exciting mountain biking trails for all skill levels",
    location: "Mountain Range",
    price: "$45/hour"
  },
  {
    name: "Art Gallery Tour",
    category: "Culture",
    description: "Guided tours of local art galleries",
    location: "City Center",
    price: "$25/person"
  },
  {
    name: "Nature Walk",
    category: "Nature",
    description: "Peaceful walks through scenic nature reserves",
    location: "National Park",
    price: "Free"
  }
]