import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Search, Users } from "lucide-react";
import TaxWizzLogo from "@/components/TaxWizzLogo";
import { Input } from "@/components/ui/input";
import IntegrationsButton from "@/components/IntegrationsButton";

const Firm = () => {
  const navigate = useNavigate();

  const clients = [
    {
      id: "1",
      name: "Acme Corporation",
      status: "In Progress",
      lastUpdated: "2023-04-15",
      taxYear: "2022",
    },
    {
      id: "2",
      name: "Globex Industries",
      status: "Completed",
      lastUpdated: "2023-03-28",
      taxYear: "2022",
    },
    {
      id: "3",
      name: "Stark Enterprises",
      status: "Review Needed",
      lastUpdated: "2023-04-10",
      taxYear: "2022",
    },
    {
      id: "4",
      name: "Wayne Enterprises",
      status: "Not Started",
      lastUpdated: "2023-02-20",
      taxYear: "2022",
    },
    {
      id: "5",
      name: "Umbrella Corporation",
      status: "In Progress",
      lastUpdated: "2023-04-05",
      taxYear: "2022",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review Needed":
        return "bg-yellow-100 text-yellow-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <TaxWizzLogo className="h-10 w-10 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
              Firm Dashboard
            </h1>
          </div>
          <div className="flex gap-3">
            <IntegrationsButton />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" /> Add New Client
            </Button>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">
                Client Management
              </h2>
              <p className="text-gray-600">
                Manage your clients' tax filings and data
              </p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10 w-full md:w-[300px]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-blue-100">
                  <th className="text-left py-3 px-4 text-blue-900 font-semibold">
                    Client Name
                  </th>
                  <th className="text-left py-3 px-4 text-blue-900 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-blue-900 font-semibold">
                    Last Updated
                  </th>
                  <th className="text-left py-3 px-4 text-blue-900 font-semibold">
                    Tax Year
                  </th>
                  <th className="text-right py-3 px-4 text-blue-900 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-blue-900">
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {client.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {client.taxYear}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(`/firm/client/${client.id}`)}
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <div>Showing 5 of 5 clients</div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled
              >
                &lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-blue-50 text-blue-600 border-blue-200"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left border-blue-100 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Client
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left border-blue-100 hover:bg-blue-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 15h8" />
                </svg>
                Generate Reports
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left border-blue-100 hover:bg-blue-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h4" />
                </svg>
                Bulk Actions
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Filing Deadlines
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">April 18, 2023</p>
                  <p className="text-sm text-red-600">
                    Individual Tax Returns Due
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="3" y2="21" />
                    <path d="M8 12h.01" />
                    <path d="M12 12h.01" />
                    <path d="M8 16h.01" />
                    <path d="M12 16h.01" />
                    <path d="M8 8h.01" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">June 15, 2023</p>
                  <p className="text-sm text-yellow-600">
                    Estimated Tax Payment Due
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="3" y2="21" />
                    <path d="M8 12h.01" />
                    <path d="M12 12h.01" />
                    <path d="M8 16h.01" />
                    <path d="M12 16h.01" />
                    <path d="M8 8h.01" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Sept 15, 2023</p>
                  <p className="text-sm text-blue-600">
                    Estimated Tax Payment Due
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="3" y2="21" />
                    <path d="M8 12h.01" />
                    <path d="M12 12h.01" />
                    <path d="M8 16h.01" />
                    <path d="M12 16h.01" />
                    <path d="M8 8h.01" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Client Status Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-900">
                    Completed
                  </span>
                  <span className="text-sm text-gray-600">1/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-900">
                    In Progress
                  </span>
                  <span className="text-sm text-gray-600">2/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-900">
                    Review Needed
                  </span>
                  <span className="text-sm text-gray-600">1/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-900">
                    Not Started
                  </span>
                  <span className="text-sm text-gray-600">1/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Firm;
