
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import TaxWizzLogo from "@/components/TaxWizzLogo";

const regions = [
  { value: "us-federal", label: "United States (Federal)" },
  { value: "us-california", label: "United States - California" },
  { value: "us-newyork", label: "United States - New York" },
  { value: "us-texas", label: "United States - Texas" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
];

const Individual = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    region: "",
    incomeType: "",
    annualIncome: "",
    documentUploaded: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast({
        title: "Document Uploaded",
        description: `Successfully uploaded: ${e.target.files[0].name}`,
      });
      setFormData({
        ...formData,
        documentUploaded: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/individual/results");
  };

  const validatePersonalInfo = () => {
    return formData.fullName && formData.email && formData.region;
  };

  const validateIncomeInfo = () => {
    return formData.incomeType && formData.annualIncome;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="container mx-auto max-w-4xl">
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
                Individual Tax Filing
              </h1>
              <p className="text-blue-600">
                Prepare your tax filing with AI assistance
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Tax Information</CardTitle>
            <CardDescription>
              Fill in your details to get a personalized tax filing draft.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger
                  value="income"
                  disabled={!validatePersonalInfo()}
                >
                  Income & Expenses
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  disabled={!validateIncomeInfo() || !validatePersonalInfo()}
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange(e, "fullName")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e, "email")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number (optional)
                      </label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange(e, "phone")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tax Region
                      </label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) =>
                          handleSelectChange(value, "region")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your tax region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem
                              key={region.value}
                              value={region.value}
                            >
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("income")}
                      disabled={!validatePersonalInfo()}
                    >
                      Next
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="income">
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="incomeType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Primary Income Type
                      </label>
                      <Select
                        value={formData.incomeType}
                        onValueChange={(value) =>
                          handleSelectChange(value, "incomeType")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employment">
                            Employment Income (W-2)
                          </SelectItem>
                          <SelectItem value="self-employment">
                            Self-Employment
                          </SelectItem>
                          <SelectItem value="rental">
                            Rental Income
                          </SelectItem>
                          <SelectItem value="investment">
                            Investment Income
                          </SelectItem>
                          <SelectItem value="mixed">
                            Multiple Income Sources
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="annualIncome"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Approximate Annual Income
                      </label>
                      <Input
                        id="annualIncome"
                        placeholder="Enter amount in USD"
                        value={formData.annualIncome}
                        onChange={(e) => handleInputChange(e, "annualIncome")}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          For a more accurate tax draft, you'll be able to upload
                          supporting documents in the next step.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("personal")}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("documents")}
                      disabled={!validateIncomeInfo()}
                    >
                      Next
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="documents">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Upload Supporting Documents
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Drag and drop your W-2, 1099, receipts, or other tax
                        documents here, or click to browse
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          document
                            .getElementById("file-upload")
                            ?.click();
                        }}
                      >
                        Upload Files
                      </Button>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                        <p className="text-sm text-yellow-700">
                          While documents are optional, they help our AI provide
                          more accurate tax optimization suggestions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("income")}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Generate Tax Draft
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Individual;
