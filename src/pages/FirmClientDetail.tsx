
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Download, Upload, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
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
const clientsData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    status: "Documents Pending",
    taxType: "Individual",
    region: "US - California",
    notes: "Client prefers email communication. Has complex investments.",
    documents: [
      { name: "Last year's tax return", uploaded: true, date: "Jan 15, 2023" },
      { name: "W-2 Form", uploaded: false, date: "" },
      { name: "1099-INT Forms", uploaded: false, date: "" },
    ],
  },
  {
    id: 2,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "(555) 987-6543",
    status: "Ready for Review",
    taxType: "Individual",
    region: "US - New York",
    notes: "New client referred by John Smith. Works remotely for multiple employers.",
    documents: [
      { name: "Last year's tax return", uploaded: true, date: "Feb 2, 2023" },
      { name: "W-2 Forms (3)", uploaded: true, date: "Feb 10, 2023" },
      { name: "Mortgage Interest Statement", uploaded: true, date: "Feb 12, 2023" },
      { name: "Charitable Donations", uploaded: false, date: "" },
    ],
  },
  {
    id: 3,
    name: "Acme Corporation",
    email: "finance@acme.com",
    phone: "(555) 222-3333",
    status: "Draft Generated",
    taxType: "Business",
    region: "US - Federal",
    notes: "S-Corporation with 12 employees. Quarterly reviews scheduled.",
    documents: [
      { name: "Prior year corporate return", uploaded: true, date: "Dec 10, 2022" },
      { name: "Balance Sheet", uploaded: true, date: "Jan 20, 2023" },
      { name: "Profit & Loss Statement", uploaded: true, date: "Jan 20, 2023" },
      { name: "Asset List", uploaded: true, date: "Jan 25, 2023" },
    ],
  },
  {
    id: 4,
    name: "Robert Chen",
    email: "robert@example.com",
    phone: "(555) 444-5555",
    status: "Completed",
    taxType: "Individual",
    region: "US - Texas",
    notes: "Returning client. Filed extension last year.",
    documents: [
      { name: "Last year's tax return", uploaded: true, date: "Dec 5, 2022" },
      { name: "W-2 Form", uploaded: true, date: "Jan 31, 2023" },
      { name: "1099-DIV Forms", uploaded: true, date: "Feb 5, 2023" },
      { name: "Real Estate Tax Statements", uploaded: true, date: "Feb 10, 2023" },
    ],
  },
  {
    id: 5,
    name: "Global Enterprises",
    email: "contact@global.com",
    phone: "(555) 777-8888",
    status: "Documents Pending",
    taxType: "Business",
    region: "US - Federal",
    notes: "International business with subsidiaries in UK and Canada.",
    documents: [
      { name: "Prior year corporate return", uploaded: true, date: "Jan 18, 2023" },
      { name: "International Operations Report", uploaded: false, date: "" },
      { name: "Consolidated Financial Statements", uploaded: false, date: "" },
    ],
  },
];

const FirmClientDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Document Request for Tax Filing");
  const [emailBody, setEmailBody] = useState(
    "Dear Client,\n\nWe are preparing your tax filing and need the following documents:\n- W-2 Forms\n- 1099 Forms (if applicable)\n- Receipts for deductible expenses\n\nPlease upload these to your client portal or reply to this email with attachments.\n\nThank you,\nYour Tax Professional"
  );

  // Find the client based on the ID from the URL
  const clientId = parseInt(id || "0");
  const client = clientsData.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
          <p className="mb-4">The client you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/firm")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: `Document request email has been sent to ${client.name}.`,
    });
    setIsEmailOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast({
        title: "Document Uploaded",
        description: `Successfully uploaded: ${e.target.files[0].name}`,
      });
    }
  };

  const handleGenerateDraft = () => {
    toast({
      title: "Draft Generated",
      description: "AI tax draft has been generated and is ready for review.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/firm")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <TaxWizzLogo className="w-10 h-10 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Client Details
              </h1>
              <p className="text-blue-600">
                Manage tax filing for {client.name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Personal and tax details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </h3>
                  <p className="font-medium">{client.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </h3>
                  <p className="font-medium">{client.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Phone
                  </h3>
                  <p className="font-medium">{client.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tax Type
                  </h3>
                  <p className="font-medium">{client.taxType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Region
                  </h3>
                  <p className="font-medium">{client.region}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <p className="font-medium">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === "Documents Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : client.status === "Ready for Review"
                          ? "bg-blue-100 text-blue-800"
                          : client.status === "Draft Generated"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Notes
                </h3>
                <p className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  {client.notes}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Tools to manage this client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start"
                onClick={() => setIsEmailOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                Request Documents
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={handleGenerateDraft}
                disabled={client.status === "Documents Pending"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
                Generate AI Tax Draft
              </Button>

              <Button
                className="w-full justify-start"
                variant="outline"
                disabled={!["Draft Generated", "Completed"].includes(client.status)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Tax Report
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Upload Documents</p>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    document.getElementById("file-upload")?.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>
              Track and manage client documents for tax filing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="required">
              <TabsList className="mb-4">
                <TabsTrigger value="required">Required Documents</TabsTrigger>
                <TabsTrigger value="uploaded">Uploaded Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="required">
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Received
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {client.documents.map((doc, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {doc.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {doc.uploaded ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Received
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.date || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {doc.uploaded ? (
                              <Button variant="link" size="sm">
                                View
                              </Button>
                            ) : (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => setIsEmailOpen(true)}
                              >
                                Request
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="uploaded">
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Uploaded
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {client.documents
                        .filter((doc) => doc.uploaded)
                        .map((doc, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {doc.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {doc.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="link"
                                size="sm"
                                className="mr-2"
                              >
                                View
                              </Button>
                              <Button variant="link" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      {client.documents.filter((doc) => doc.uploaded).length ===
                        0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-8 text-center text-sm text-gray-500"
                          >
                            No documents have been uploaded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Document Request</DialogTitle>
            <DialogDescription>
              Customize the email to request documents from this client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor="emailSubject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Subject
              </label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="emailBody"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Body
              </label>
              <textarea
                id="emailBody"
                rows={8}
                className="w-full rounded-md border border-gray-300 p-3"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              <Send className="mr-2 h-4 w-4" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirmClientDetail;
