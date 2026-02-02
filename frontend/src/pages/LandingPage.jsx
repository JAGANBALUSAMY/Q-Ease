import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Search, 
  QrCode, 
  Ticket, 
  Clock, 
  Users, 
  Building2, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Bell
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'Find Organizations',
      description: 'Search and browse organizations near you with active queues',
      color: 'text-blue-500'
    },
    {
      icon: Ticket,
      title: 'Join Queue',
      description: 'Get your digital token instantly and skip the physical line',
      color: 'text-emerald-500'
    },
    {
      icon: Bell,
      title: 'Get Notified',
      description: 'Receive real-time updates when it\'s almost your turn',
      color: 'text-amber-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '500+', label: 'Organizations', icon: Building2 },
    { value: '50K+', label: 'Tokens Issued', icon: Ticket },
    { value: '98%', label: 'Satisfaction', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-primary">Now serving 10,000+ users daily</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Skip the Wait,
                  <br />
                  <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-zinc-900 dark:from-slate-300 dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                    Track Your Turn
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                  Join queues digitally, track your position in real-time, and get notified when it's your turn. 
                  No more standing in long lines.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    className="w-full h-14 pl-12 pr-32 rounded-2xl border bg-background/80 backdrop-blur-sm text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Search hospitals, clinics, offices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                  >
                    Search
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-xl"
                  onClick={() => navigate('/scan')}
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Scan QR Code
                </Button>
                {user && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="rounded-xl"
                    onClick={() => navigate('/my-tokens')}
                  >
                    <Ticket className="mr-2 h-5 w-5" />
                    My Tokens
                  </Button>
                )}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Floating Cards */}
                <Card className="absolute -top-4 -left-8 w-64 shadow-xl animate-fade-in border-2">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Token #A042</p>
                      <p className="text-sm text-muted-foreground">Position: 3rd in line</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  </CardContent>
                </Card>

                <Card className="absolute top-24 -right-4 w-56 shadow-xl animate-fade-in border-2 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20" style={{ animationDelay: '0.2s' }}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">Your turn!</p>
                      <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">Proceed to counter</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute bottom-8 left-0 w-52 shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold">~15 min wait</p>
                      <p className="text-sm text-muted-foreground">5 people ahead</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Illustration */}
                <div className="w-72 h-72 mx-auto rounded-3xl bg-gradient-to-br from-slate-200 via-slate-300 to-zinc-300 dark:from-slate-700 dark:via-slate-800 dark:to-zinc-800 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-900 flex items-center justify-center text-white shadow-2xl">
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-2xl font-bold">Q-Ease</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-muted rounded-full flex items-end justify-start pb-6 pl-6">
                      <span className="text-4xl font-bold text-muted-foreground/30">{index + 1}</span>
                    </div>
                    
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", 
                      index === 0 ? "bg-blue-500/10" : index === 1 ? "bg-emerald-500/10" : "bg-amber-500/10"
                    )}>
                      <Icon className={cn("h-7 w-7", feature.color)} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <Card className="overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-zinc-900 border-0">
            <CardContent className="p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to skip the wait?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of users who are saving time every day with Q-Ease
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {user ? (
                  <Button 
                    size="xl" 
                    variant="secondary"
                    className="bg-white text-slate-900 hover:bg-white/90"
                    onClick={() => navigate('/search')}
                  >
                    Browse Organizations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="xl" 
                      variant="secondary"
                      className="bg-white text-slate-900 hover:bg-white/90"
                      onClick={() => navigate('/register')}
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="xl" 
                      variant="outline"
                      className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container-wide">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-zinc-900 flex items-center justify-center text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold">Q-Ease</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making queues easier, one token at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Q-Ease. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
