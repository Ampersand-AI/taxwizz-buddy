import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle, AlertCircle } from "lucide-react";
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
import TaxWizzLogo from "@/components/TaxWizzLogo";
import { useTranslation } from "react-i18next";

const IndividualResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleDownload = () => {
    toast({
      title: t('results.downloadSuccess'),
      description: t('results.downloadDescription'),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/individual")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <TaxWizzLogo className="w-10 h-10 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                {t('results.title', 'Tax Draft Results')}
              </h1>
              <p className="text-blue-600">
                {t('results.subtitle', 'AI-generated tax filing recommendations')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800 mb-1">
              {t('results.successTitle', 'Tax Draft Generated Successfully')}
            </h3>
            <p className="text-green-700 text-sm">
              {t('results.successDescription', 'Our AI has analyzed your information and prepared a tax filing draft with optimization suggestions based on current tax laws for your region.')}
            </p>
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="summary">{t('results.summary', 'Summary')}</TabsTrigger>
            <TabsTrigger value="detailed">{t('results.detailed', 'Detailed Report')}</TabsTrigger>
            <TabsTrigger value="optimizations">
              {t('results.optimizations', 'Tax Optimizations')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>{t('results.summaryTitle', 'Tax Filing Summary')}</CardTitle>
                <CardDescription>
                  {t('results.summaryDescription', 'Overview of your current tax situation')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">{t('results.totalIncome', 'Total Income')}</p>
                      <p className="text-2xl font-bold text-blue-900">
                        $85,000.00
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">
                        {t('results.estimatedTax', 'Estimated Tax Due')}
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        $14,280.00
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">
                        {t('results.potentialDeductions', 'Potential Deductions')}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        $12,500.00
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">
                        {t('results.potentialSavings', 'Potential Tax Savings')}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        $2,750.00
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">
                      {t('results.summaryAnalysis', 'Summary Analysis')}
                    </h3>
                    <p className="text-blue-700 mb-4">
                      {t('results.analysisDescription', "Based on the information provided, you're in the 22% tax bracket for federal taxes. We've identified several potential deductions that could reduce your tax liability.")}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleDownload}
                        className="flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t('results.downloadSummary', 'Download Summary Report')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Tax Report</CardTitle>
                <CardDescription>
                  Comprehensive breakdown of your tax filing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-lg text-blue-900 mb-3">
                      Income Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">Employment Income</span>
                        <span className="font-medium">$85,000.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Interest & Dividends
                        </span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">Other Income</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between text-blue-900 font-semibold pt-1">
                        <span>Total Income</span>
                        <span>$85,000.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-lg text-blue-900 mb-3">
                      Deductions & Credits
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Standard Deduction
                        </span>
                        <span className="font-medium">$12,950.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Retirement Contributions
                        </span>
                        <span className="font-medium">$6,500.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Health Savings Account
                        </span>
                        <span className="font-medium">$3,850.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Other Deductions
                        </span>
                        <span className="font-medium">$2,150.00</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-semibold pt-1">
                        <span>Total Potential Deductions</span>
                        <span>$25,450.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-lg text-blue-900 mb-3">
                      Tax Calculation
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Adjusted Gross Income
                        </span>
                        <span className="font-medium">$72,500.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Taxable Income
                        </span>
                        <span className="font-medium">$59,550.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">Federal Tax (22%)</span>
                        <span className="font-medium">$11,530.00</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">State Tax (Est.)</span>
                        <span className="font-medium">$2,750.00</span>
                      </div>
                      <div className="flex justify-between text-blue-900 font-semibold pt-1">
                        <span>Total Estimated Tax</span>
                        <span>$14,280.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleDownload}
                      className="flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Detailed Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimizations">
            <Card>
              <CardHeader>
                <CardTitle>Tax Optimization Suggestions</CardTitle>
                <CardDescription>
                  AI-powered recommendations to reduce your tax liability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-800 mb-1">
                          Maximize Retirement Contributions
                        </h3>
                        <p className="text-green-700 mb-2">
                          You can contribute up to $22,500 to your 401(k) for
                          2023. Increasing your contribution from $6,500 to the
                          maximum could save you approximately $3,520 in taxes.
                        </p>
                        <div className="bg-white rounded p-3 text-sm">
                          <p className="font-medium text-blue-900 mb-1">
                            Potential Tax Saving: $3,520
                          </p>
                          <p className="text-gray-600">
                            Consider allocating more to your retirement account
                            before the end of the tax year.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-800 mb-1">
                          Health Savings Account (HSA)
                        </h3>
                        <p className="text-green-700 mb-2">
                          You're currently contributing $3,850 to your HSA. If
                          you have a family plan, you could increase this to
                          $7,750, saving an additional $858 in taxes.
                        </p>
                        <div className="bg-white rounded p-3 text-sm">
                          <p className="font-medium text-blue-900 mb-1">
                            Potential Tax Saving: $858
                          </p>
                          <p className="text-gray-600">
                            HSA contributions are triple-tax advantaged: tax-free
                            contributions, growth, and withdrawals for qualified
                            medical expenses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-800 mb-1">
                          Consider Itemizing Deductions
                        </h3>
                        <p className="text-green-700 mb-2">
                          Based on your profile, itemizing deductions instead of
                          taking the standard deduction might be beneficial if
                          you have significant mortgage interest, state and local
                          taxes, or charitable contributions.
                        </p>
                        <div className="bg-white rounded p-3 text-sm">
                          <p className="font-medium text-blue-900 mb-1">
                            Action Required
                          </p>
                          <p className="text-gray-600">
                            Collect receipts for charitable donations, medical
                            expenses, and other potential deductions to determine
                            if itemizing would exceed your standard deduction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800 mb-1">
                          Important Note
                        </h3>
                        <p className="text-yellow-700 text-sm">
                          These optimization suggestions are based on the
                          information provided and current tax laws. For
                          personalized tax advice, consult with a qualified tax
                          professional.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleDownload}
                      className="flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Optimization Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IndividualResults;
