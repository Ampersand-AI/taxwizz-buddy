
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaxWizzLogo from "@/components/TaxWizzLogo";

// Sample client data
const sampleClients = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    status: "Documents Pending",
    taxType: "Individual",
    region: "US - California",
  },
  {
    id: 2,
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "Ready for Review",
    taxType: "Individual",
    region: "US - New York",
  },
  {
    id: 3,
    name: "Acme Corporation",
    email: "finance@acme.com",
    status: "Draft Generated",
    taxType: "Business",
    region: "US - Federal",
  },
  {
    id: 4,
    name: "Robert Chen",
    email: "robert@example.com",
    status: "Completed",
    taxType: "Individual",
    region: "US - Texas",
  },
  {
    id: 5,
    name: "Global Enterprises",
    email: "contact@global.com",
    status: "Documents Pending",
    taxType: "Business",
    region: "US - Federal",
  },
];

const Firm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState(sampleClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    taxType: "Individual",
    region: "US - Federal",
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.taxType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newClientObj = {
      id: clients.length + 1,
      ...newClient,
      status: "New Client",
    };

    setClients([...clients, newClientObj]);
    setIsAddClientOpen(false);
    setNewClient({
      name: "",
      email: "",
      taxType: "Individual",
      region: "US - Federal",
    });

    toast({
      title: "Client Added",
      description: "New client has been added successfully.",
    });
  };

  const handleClientAction = (clientId: number, action: string) => {
    if (action === "view") {
      navigate(`/firm/client/${clientId}`);
    } else if (action === "request") {
      toast({
        title: "Documents Requested",
        description: "Document request email has been sent to the client.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Documents Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Ready for Review":
        return "bg-blue-100 text-blue-800";
      case "Draft Generated":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "New Client":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <TaxWizzLogo className="w-10 h-10 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Accounting Firm Dashboard
              </h1>
              <p className="text-blue-600">
                Manage your clients and tax filings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Clients</CardTitle>
              <CardDescription>Active client accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <span className="text-3xl font-bold">{clients.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Documents</CardTitle>
              <CardDescription>Awaiting client information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-yellow-500 mr-3"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 18v-1" />
                  <path d="M16 18v-3" />
                </svg>
                <span className="text-3xl font-bold">
                  {
                    clients.filter(
                      (client) => client.status === "Documents Pending"
                    ).length
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Filings</CardTitle>
              <CardDescription>
                Successfully processed tax returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-green-500 mr-3"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M9 15 l2 2 l4 -4" />
                </svg>
                <span className="text-3xl font-bold">
                  {
                    clients.filter((client) => client.status === "Completed")
                      .length
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Manage tax filings for all your clients
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => setIsAddClientOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, email, status..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Tax Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div>
                            {client.name}
                            <div className="text-sm text-gray-500">
                              {client.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{client.taxType}</TableCell>
                        <TableCell>{client.region}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              client.status
                            )}`}
                          >
                            {client.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() =>
                              handleClientAction(client.id, "view")
                            }
                          >
                            View
                          </Button>
                          {client.status !== "Completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleClientAction(client.id, "request")
                              }
                            >
                              Request Docs
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        No clients found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client's information to create a new account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Client Name *
              </label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="clientEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="Enter client email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="taxType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Type
              </label>
              <select
                id="taxType"
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                value={newClient.taxType}
                onChange={(e) =>
                  setNewClient({ ...newClient, taxType: e.target.value })
                }
              >
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
                <option value="Non-Profit">Non-Profit</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Region
              </label>
              <select
                id="region"
                className="w-full rounded-md border border-gray-300 py-2 px-3"
                value={newClient.region}
                onChange={(e) =>
                  setNewClient({ ...newClient, region: e.target.value })
                }
              >
                <option value="US - Federal">US - Federal</option>
                <option value="US - California">US - California</option>
                <option value="US - New York">US - New York</option>
                <option value="US - Texas">US - Texas</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClient}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Firm;
