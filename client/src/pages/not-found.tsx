import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-[#1e293b] border dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Did you forget to add the page to the router?
          </p>

          <div className="mt-6">
            <Link 
              href="/"
              className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Басты бетке оралу</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
