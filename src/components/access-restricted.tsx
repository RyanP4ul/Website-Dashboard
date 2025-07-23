import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AccessRestricted = () => {
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border border-border shadow-card">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Access Restricted
          </h1>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            You don't have sufficient permissions to access this area. 
            Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRestricted;