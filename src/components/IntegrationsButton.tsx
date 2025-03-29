
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function IntegrationsButton() {
  const { t } = useTranslation();
  
  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
      asChild
    >
      <Link to="/integrations">
        {t('common.manageIntegrations')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
