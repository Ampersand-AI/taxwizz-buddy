import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Download, Upload, Send, CheckCircle, FileText, Loader2 } from "lucide-react";
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
import { generateTaxSuggestions } from "@/lib/ai-utils";
import { useTranslation } from "react-i18next";

// Define tax draft type to include fullReport property
interface TaxDraft {
  summary: string;
  date: string;
  status: string;
  fullReport?: string;  // Added the missing property
}

// Region-specific document requirements
const documentRequirements = {
  "US - California": [
    { id: "w2", name: "W-2 Form", required: true },
    { id: "1099", name: "1099 Forms (if applicable)", required: false },
    { id: "mortgage", name: "Mortgage Interest Statement", required: false },
    { id: "property", name: "Property Tax Statements", required: false },
    { id: "charity", name: "Charitable Donation Receipts", required: false },
    { id: "medical", name: "Medical Expense Records", required: false },
    { id: "ca-540", name: "California Form 540", required: true },
  ],
  "US - New York": [
    { id: "w2", name: "W-2 Form", required: true },
    { id: "1099", name: "1099 Forms (if applicable)", required: false },
    { id: "rent", name: "NY Rent Payment Records", required: false },
    { id: "it201", name: "NY State Form IT-201", required: true },
    { id: "charity", name: "Charitable Donation Receipts", required: false },
    { id: "medical", name: "Medical Expense Records", required: false },
  ],
  "US - Texas": [
    { id: "w2", name: "W-2 Form", required: true },
    { id: "1099", name: "1099 Forms (if applicable)", required: false },
    { id: "property", name: "Property Tax Statements", required: false },
    { id: "business", name: "Business Income Records", required: false },
  ],
  "US - Federal": [
    { id: "ein", name: "EIN Documentation", required: true },
    { id: "p&l", name: "Profit & Loss Statement", required: true },
    { id: "balance", name: "Balance Sheet", required: true },
    { id: "1120s", name: "Form 1120-S (for S-Corps)", required: false },
    { id: "k1", name: "Schedule K-1", required: false },
    { id: "assets", name: "Asset Depreciation Schedule", required: true },
  ],
  "UK - England": [
    { id: "p60", name: "P60 End of Year Certificate", required: true },
    { id: "p45", name: "P45 (if changed jobs)", required: false },
    { id: "p11d", name: "P11D (benefits and expenses)", required: false },
    { id: "sa102", name: "Self Assessment Form SA102", required: false },
    { id: "property", name: "Property Income Records", required: false },
  ],
  "India - Maharashtra": [
    { id: "form16", name: "Form 16 (from employer)", required: true },
    { id: "form26as", name: "Form 26AS (Tax Credit Statement)", required: true },
    { id: "pan", name: "PAN Card Copy", required: true },
    { id: "investment", name: "Investment Proofs for Tax Saving", required: false },
    { id: "rent", name: "Rent Receipts (if applicable)", required: false },
  ],
  "Australia - Victoria": [
    { id: "payg", name: "PAYG Payment Summary", required: true },
    { id: "deductions", name: "Work-Related Deduction Evidence", required: false },
    { id: "super", name: "Superannuation Statements", required: true },
    { id: "dividend", name: "Dividend Statements", required: false },
    { id: "medical", name: "Medical Expense Records", required: false },
  ],
  "Singapore": [
    { id: "ir8a", name: "IR8A Form (from employer)", required: true },
    { id: "ir8s", name: "IR8S (if applicable)", required: false },
    { id: "donation", name: "Donation Receipts", required: false },
    { id: "cpf", name: "CPF Contribution History", required: true },
    { id: "relief", name: "Supporting Documents for Relief Claims", required: false },
  ],
};

// Sample client data with enhanced region support
interface Document {
  id: string;
  name: string;
  uploaded: boolean;
  date: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  taxType: string;
  region: string;
  notes: string;
  documents: Document[];
  taxDraft: TaxDraft | null;
}

const clientsData: Client[] = [
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
      { id: "last-year", name: "Last year's tax return", uploaded: true, date: "Jan 15, 2023" },
      { id: "w2", name: "W-2 Form", uploaded: false, date: "" },
      { id: "1099", name: "1099-INT Forms", uploaded: false, date: "" },
    ],
    taxDraft: null,
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
      { id: "last-year", name: "Last year's tax return", uploaded: true, date: "Feb 2, 2023" },
      { id: "w2", name: "W-2 Forms (3)", uploaded: true, date: "Feb 10, 2023" },
      { id: "mortgage", name: "Mortgage Interest Statement", uploaded: true, date: "Feb 12, 2023" },
      { id: "charity", name: "Charitable Donations", uploaded: false, date: "" },
    ],
    taxDraft: null,
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
      { id: "last-year", name: "Prior year corporate return", uploaded: true, date: "Dec 10, 2022" },
      { id: "balance", name: "Balance Sheet", uploaded: true, date: "Jan 20, 2023" },
      { id: "p&l", name: "Profit & Loss Statement", uploaded: true, date: "Jan 20, 2023" },
      { id: "assets", name: "Asset List", uploaded: true, date: "Jan 25, 2023" },
    ],
    taxDraft: {
      summary: "S-Corporation filing shows $1.2M revenue with $280K taxable income. Estimated tax liability is $58,800 federal. Potential tax savings through R&D credits and depreciation optimization.",
      date: "Feb 10, 2023",
      status: "Ready for Review",
      fullReport: undefined
    },
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
      { id: "last-year", name: "Last year's tax return", uploaded: true, date: "Dec 5, 2022" },
      { id: "w2", name: "W-2 Form", uploaded: true, date: "Jan 31, 2023" },
      { id: "1099", name: "1099-DIV Forms", uploaded: true, date: "Feb 5, 2023" },
      { id: "property", name: "Real Estate Tax Statements", uploaded: true, date: "Feb 10, 2023" },
    ],
    taxDraft: {
      summary: "Individual filing with $85K W-2 income and $12K capital gains. Standard deduction recommended. Estimated federal tax due: $14,280.",
      date: "Feb 20, 2023",
      status: "Approved",
      fullReport: undefined
    },
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
      { id: "last-year", name: "Prior year corporate return", uploaded: true, date: "Jan 18, 2023" },
      { id: "int-ops", name: "International Operations Report", uploaded: false, date: "" },
      { id: "financials", name: "Consolidated Financial Statements", uploaded: false, date: "" },
    ],
    taxDraft: null,
  },
  {
    id: 6,
    name: "Meera Patel",
    email: "meera@example.com",
    phone: "(+91) 98765-43210",
    status: "Documents Pending",
    taxType: "Individual",
    region: "India - Maharashtra",
    notes: "First time client with multiple income sources including rental property.",
    documents: [
      { id: "form16", name: "Form 16", uploaded: true, date: "Apr 10, 2023" },
      { id: "form26as", name: "Form 26AS", uploaded: false, date: "" },
      { id: "investment", name: "Investment Proofs", uploaded: false, date: "" },
    ],
    taxDraft: null,
  },
  {
    id: 7,
    name: "William Barnes",
    email: "william@example.com",
    phone: "(+44) 7700-900123",
    status: "Ready for Review",
    taxType: "Individual",
    region: "UK - England",
    notes: "Self-employed consultant with home office expenses.",
    documents: [
      { id: "p60", name: "P60", uploaded: true, date: "May 5, 2023" },
      { id: "expenses", name: "Business Expense Records", uploaded: true, date: "May 10, 2023" },
      { id: "bank", name: "Bank Statements", uploaded: true, date: "May 12, 2023" },
    ],
    taxDraft: null,
  },
];

const FirmClientDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Document Request for Tax Filing");
  const [emailBody, setEmailBody] = useState(
    "Dear Client,\n\nWe are preparing your tax filing and need the following documents:\n- W-2 Forms\n- 1099 Forms (if applicable)\n- Receipts for deductible expenses\n\nPlease upload these to your client portal or reply to this email with attachments.\n\nThank you,\nYour Tax Professional"
  );
  const [clientData, setClientData] = useState(clientsData);

  // Find the client based on the ID from the URL
  const clientId = parseInt(id || "0");
  const client = clientData.find((c) => c.id === clientId);

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

  // Get region-specific document requirements
  const requiredDocuments = documentRequirements[client.region as keyof typeof documentRequirements] || [];
  
  // Combine client documents with region requirements
  const allDocuments = [...client.documents];
  
  // Add missing required documents based on region
  requiredDocuments.forEach(reqDoc => {
    if (!allDocuments.some(doc => doc.id === reqDoc.id)) {
      if (reqDoc.required) {
        allDocuments.push({
          id: reqDoc.id,
          name: reqDoc.name,
          uploaded: false,
          date: ""
        });
      }
    }
  });

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: `Document request email has been sent to ${client.name}.`,
    });
    setIsEmailOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filename = e.target.files[0].name;
      
      // Update the client's documents
      const updatedClients = clientData.map(c => {
        if (c.id === clientId) {
          // Try to find a matching document
          const matchingDocIndex = c.documents.findIndex(
            doc => !doc.uploaded && filename.toLowerCase().includes(doc.name.toLowerCase())
          );
          
          if (matchingDocIndex >= 0) {
            // Update the existing document
            const updatedDocuments = [...c.documents];
            updatedDocuments[matchingDocIndex] = {
              ...updatedDocuments[matchingDocIndex],
              uploaded: true,
              date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            };
            return { ...c, documents: updatedDocuments };
          } else {
            // Add as a new document
            return {
              ...c, 
              documents: [
                ...c.documents,
                {
                  id: `upload-${Date.now()}`,
                  name: filename,
                  uploaded: true,
                  date: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                }
              ]
            };
          }
        }
        return c;
      });
      
      setClientData(updatedClients);
      
      toast({
        title: "Document Uploaded",
        description: `Successfully uploaded: ${filename}`,
      });
      
      // Check if we should update client status
      const updatedClient = updatedClients.find(c => c.id === clientId);
      if (updatedClient && updatedClient.status === "Documents Pending") {
        // If all required documents are uploaded, update status
        const requiredDocs = requiredDocuments.filter(d => d.required);
        const allRequiredUploaded = requiredDocs.every(reqDoc => 
          updatedClient.documents.some(doc => 
            doc.id === reqDoc.id && doc.uploaded
          )
        );
        
        if (allRequiredUploaded) {
          const clientsWithUpdatedStatus = updatedClients.map(c => 
            c.id === clientId ? { ...c, status: "Ready for Review" } : c
          );
          setClientData(clientsWithUpdatedStatus);
          
          toast({
            title: "Status Updated",
            description: "All required documents uploaded. Status changed to Ready for Review.",
          });
        }
      }
    }
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare data for AI processing
      const taxData = {
        clientName: client.name,
        taxType: client.taxType,
        region: client.region,
        documents: client.documents.filter(doc => doc.uploaded).map(doc => doc.name),
        // Add any other relevant data here
      };
      
      // Generate tax suggestions using AI
      const suggestions = await generateTaxSuggestions(taxData);
      
      // Update client with tax draft
      const updatedClients = clientData.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            status: "Draft Generated",
            taxDraft: {
              summary: suggestions.substring(0, 300), // Truncate to prevent overly long summaries
              date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }),
              status: "Ready for Review",
              fullReport: suggestions
            }
          };
        }
        return c;
      });
      
      setClientData(updatedClients);
      setIsPreviewOpen(true);
      
      toast({
        title: "Draft Generated",
        description: "AI tax draft has been generated and is ready for review.",
      });
    } catch (error) {
      console.error("Error generating tax draft:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate tax draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getMissingRequiredDocuments = () => {
    const requiredDocs = requiredDocuments.filter(doc => doc.required);
    return requiredDocs.filter(reqDoc => 
      !client.documents.some(doc => doc.id === reqDoc.id && doc.uploaded)
    );
  };

  const canGenerateDraft = () => {
    return client.status !== "Documents Pending" || getMissingRequiredDocuments().length === 0;
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

        {client.taxDraft && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 mb-1">
                Tax Draft Generated
              </h3>
              <p className="text-green-700 text-sm mb-2">
                {client.taxDraft.summary}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => setIsPreviewOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Tax Draft
              </Button>
            </div>
          </div>
        )}

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
                disabled={!canGenerateDraft() || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
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
                )}
                {isGenerating ? "Generating..." : "Generate AI Tax Draft"}
              </Button>

              {!canGenerateDraft() && client.status === "Documents Pending" && (
                <div className="text-xs text-amber-600 mt-1">
                  Missing required documents for {client.region}
                </div>
              )}

              <Button
                className="w-full justify-start"
                variant="outline"
                disabled={!["Draft Generated", "Completed"].includes(client.status)}
                onClick={() => client.taxDraft && setIsPreviewOpen(true)}
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
              Track and manage client documents for tax filing in {client.region}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="required">
              <TabsList className="mb-4">
                <TabsTrigger value="required">Required Documents</TabsTrigger>
                <TabsTrigger value="uploaded">Uploaded Documents</TabsTrigger>
                <TabsTrigger value="region">Region-Specific Requirements</TabsTrigger>
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
                      {allDocuments.map((doc, index) => (
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
                      {allDocuments
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
                      {allDocuments.filter((doc) => doc.uploaded).length ===
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

              <TabsContent value="region">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <h3 className="font-medium text-blue-800 mb-2">
                    {client.region} Tax Filing Requirements
                  </h3>
                  <p className="text-blue-700 text-
