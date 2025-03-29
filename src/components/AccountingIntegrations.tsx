
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ACCOUNTING_SOFTWARE, initiateAccountingSoftwareAuth } from "@/lib/accounting-integrations";

export default function AccountingIntegrations() {
  const handleIntegrate = async (softwareId: string) => {
    try {
      const result = await initiateAccountingSoftwareAuth(softwareId);
      if (result) {
        toast({
          title: "Integration Started",
          description: "Please complete the authentication process in the new window.",
        });
      } else {
        toast({
          title: "Integration Unavailable",
          description: "This integration is not available yet. Please check back later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Integration Failed",
        description: "Could not initiate integration. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Accounting Software Integrations</h2>
        <p className="text-gray-600">
          Connect your accounting software to automatically import financial data and streamline your tax preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACCOUNTING_SOFTWARE.map((software) => (
          <Card key={software.id} className="border-blue-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded overflow-hidden flex items-center justify-center bg-blue-50">
                  <img 
                    src={software.icon} 
                    alt={software.name} 
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100/e0f2fe/1e40af?text=?";
                    }} 
                  />
                </div>
                <CardTitle className="text-lg font-semibold text-blue-900">{software.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                {software.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => handleIntegrate(software.id)}
              >
                {software.isAvailable ? "Connect" : "Coming Soon"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These integrations are in development. When available, they will allow you to import your financial data directly from your accounting software for more accurate tax planning and preparation.
        </p>
      </div>
    </div>
  );
}
