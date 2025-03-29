
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AccountingIntegrations from "@/components/AccountingIntegrations";
import TaxWizzLogo from "@/components/TaxWizzLogo";

export default function Integrations() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <TaxWizzLogo className="h-10 w-10 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">TaxWizz Integrations</h1>
          </div>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back
          </Button>
        </header>

        <main className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 md:p-8">
          <AccountingIntegrations />

          <div className="mt-10 pt-8 border-t border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">API Integration</h2>
            <p className="text-gray-600 mb-4">
              TaxWizz uses OpenAI's API for intelligent tax suggestions and optimizations. Your API key has been configured.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                <span className="font-medium">✓ OpenAI API Integration:</span> Successfully configured
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
