import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  QrCode, 
  Keyboard,
  AlertCircle,
  Camera,
  RefreshCw
} from 'lucide-react';

const QRScanPage = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    startScanner();

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, []);

  const startScanner = () => {
    try {
      setError(null);
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanError);
      setScanner(html5QrcodeScanner);
      setScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Failed to start camera. Please check permissions.');
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log('QR Code scanned:', decodedText);

    try {
      const url = new URL(decodedText);
      const pathname = url.pathname;

      if (pathname.includes('/org/')) {
        const orgCode = pathname.split('/org/')[1];
        navigate(`/org/${orgCode}`);
      } else if (pathname.includes('/queue/')) {
        const queueId = pathname.split('/queue/')[1];
        navigate(`/queue/${queueId}`);
      } else if (pathname.includes('/token/')) {
        const tokenId = pathname.split('/token/')[1];
        navigate(`/token/${tokenId}`);
      } else {
        window.location.href = decodedText;
      }
    } catch (err) {
      navigate(`/org/${decodedText}`);
    }
  };

  const onScanError = (errorMessage) => {
    if (!errorMessage.includes('NotFoundException')) {
      console.warn('QR Scan error:', errorMessage);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      navigate(`/org/${manualCode.trim()}`);
    }
  };

  const handleRetry = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    startScanner();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Scan QR Code</h1>
            <p className="text-muted-foreground mt-1">
              Point your camera at a Q-Ease QR code to join a queue
            </p>
          </div>
        </div>

        {/* Scanner Section */}
        {error ? (
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Camera Error</h3>
                <p className="text-muted-foreground mt-1">{error}</p>
              </div>
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* QR Reader Container */}
              <div className="relative rounded-lg overflow-hidden bg-black">
                <div id="qr-reader" className="w-full"></div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Allow camera access</p>
                    <p className="text-xs text-muted-foreground">Grant permission when prompted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Position QR code</p>
                    <p className="text-xs text-muted-foreground">Align within the frame</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Wait for detection</p>
                    <p className="text-xs text-muted-foreground">Automatic redirect on success</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Divider */}
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            or enter code manually
          </span>
        </div>

        {/* Manual Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Enter the organization code directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="flex gap-3">
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter organization code"
                className="flex-1"
              />
              <Button type="submit" disabled={!manualCode.trim()}>
                Go
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Custom styles for the QR scanner */}
      <style>{`
        #qr-reader {
          border: none !important;
        }
        #qr-reader video {
          border-radius: 0.5rem;
        }
        #qr-reader__scan_region {
          background: transparent !important;
        }
        #qr-reader__dashboard {
          padding: 1rem !important;
        }
        #qr-reader__dashboard_section_csr button {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border: none !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 1rem !important;
          cursor: pointer !important;
        }
        #qr-reader__dashboard_section_swaplink {
          color: hsl(var(--primary)) !important;
          text-decoration: none !important;
        }
      `}</style>
    </div>
  );
};

export default QRScanPage;
