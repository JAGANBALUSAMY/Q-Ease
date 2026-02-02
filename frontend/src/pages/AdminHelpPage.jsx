import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Search,
  BookOpen,
  Rocket,
  Users,
  BarChart3,
  Settings,
  Wrench,
  Mail,
  MessageCircle,
  Phone,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminHelpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'getting-started', name: 'Getting Started', icon: Rocket, color: 'blue' },
    { id: 'queue-management', name: 'Queue Management', icon: BookOpen, color: 'green' },
    { id: 'user-management', name: 'User Management', icon: Users, color: 'purple' },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3, color: 'amber' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'slate' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: Wrench, color: 'red' }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'Creating Your First Queue',
      category: 'getting-started',
      content: 'Learn how to set up your first service queue with proper configurations.',
      difficulty: 'beginner'
    },
    {
      id: 2,
      title: 'Managing Staff Assignments',
      category: 'user-management',
      content: 'How to assign and manage staff members to different queues.',
      difficulty: 'intermediate'
    },
    {
      id: 3,
      title: 'Understanding Analytics Dashboard',
      category: 'analytics',
      content: 'Guide to interpreting the analytics data and performance metrics.',
      difficulty: 'intermediate'
    },
    {
      id: 4,
      title: 'Queue Priority Settings',
      category: 'queue-management',
      content: 'Configure priority and emergency service options for your queues.',
      difficulty: 'advanced'
    },
    {
      id: 5,
      title: 'System Settings Configuration',
      category: 'settings',
      content: 'Customize system-wide settings and organization preferences.',
      difficulty: 'advanced'
    },
    {
      id: 6,
      title: 'Common Issues and Solutions',
      category: 'troubleshooting',
      content: 'Frequently encountered problems and their resolutions.',
      difficulty: 'beginner'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyConfig = (difficulty) => {
    switch(difficulty) {
      case 'beginner': 
        return { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'intermediate': 
        return { label: 'Intermediate', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
      case 'advanced': 
        return { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default: 
        return { label: 'General', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' };
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = helpCategories.find(c => c.id === categoryId);
    return category?.icon || HelpCircle;
  };

  const getCategoryColor = (categoryId) => {
    const category = helpCategories.find(c => c.id === categoryId);
    return category?.color || 'slate';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground mt-2">
              Find answers to your questions and learn how to use Q-Ease effectively
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {helpCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {helpCategories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  selectedCategory === category.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
                  category.color === 'blue' && "bg-blue-100 dark:bg-blue-900/30",
                  category.color === 'green' && "bg-green-100 dark:bg-green-900/30",
                  category.color === 'purple' && "bg-purple-100 dark:bg-purple-900/30",
                  category.color === 'amber' && "bg-amber-100 dark:bg-amber-900/30",
                  category.color === 'slate' && "bg-slate-100 dark:bg-slate-900/30",
                  category.color === 'red' && "bg-red-100 dark:bg-red-900/30"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    category.color === 'blue' && "text-blue-600 dark:text-blue-400",
                    category.color === 'green' && "text-green-600 dark:text-green-400",
                    category.color === 'purple' && "text-purple-600 dark:text-purple-400",
                    category.color === 'amber' && "text-amber-600 dark:text-amber-400",
                    category.color === 'slate' && "text-slate-600 dark:text-slate-400",
                    category.color === 'red' && "text-red-600 dark:text-red-400"
                  )} />
                </div>
                <p className="font-medium text-sm">{category.name}</p>
              </button>
            );
          })}
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {selectedCategory === 'all' ? 'All Help Articles' : 
               helpCategories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <Badge variant="secondary">{filteredArticles.length} articles</Badge>
          </div>
          
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredArticles.map(article => {
                const CategoryIcon = getCategoryIcon(article.category);
                const diffConfig = getDifficultyConfig(article.difficulty);
                const categoryColor = getCategoryColor(article.category);
                
                return (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          categoryColor === 'blue' && "bg-blue-100 dark:bg-blue-900/30",
                          categoryColor === 'green' && "bg-green-100 dark:bg-green-900/30",
                          categoryColor === 'purple' && "bg-purple-100 dark:bg-purple-900/30",
                          categoryColor === 'amber' && "bg-amber-100 dark:bg-amber-900/30",
                          categoryColor === 'slate' && "bg-slate-100 dark:bg-slate-900/30",
                          categoryColor === 'red' && "bg-red-100 dark:bg-red-900/30"
                        )}>
                          <CategoryIcon className={cn(
                            "w-5 h-5",
                            categoryColor === 'blue' && "text-blue-600 dark:text-blue-400",
                            categoryColor === 'green' && "text-green-600 dark:text-green-400",
                            categoryColor === 'purple' && "text-purple-600 dark:text-purple-400",
                            categoryColor === 'amber' && "text-amber-600 dark:text-amber-400",
                            categoryColor === 'slate' && "text-slate-600 dark:text-slate-400",
                            categoryColor === 'red' && "text-red-600 dark:text-red-400"
                          )} />
                        </div>
                        <Badge className={cn("text-xs", diffConfig.color)}>
                          {diffConfig.label}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mt-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {article.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground">
                          {helpCategories.find(c => c.id === article.category)?.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Our support team is here to assist you with any questions or issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@qease.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Live Chat</p>
                  <p className="text-xs text-muted-foreground">Available 24/7</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Phone Support</p>
                  <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHelpPage;
