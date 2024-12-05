import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const FriendRequests = () => {
  return (
   
    <div>
        <Tabs defaultValue="account" className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Caerd
        </TabsContent>
        <TabsContent value="password">
          Box
        </TabsContent>
      </Tabs>
      </div>
  
  
  )
}

export default FriendRequests