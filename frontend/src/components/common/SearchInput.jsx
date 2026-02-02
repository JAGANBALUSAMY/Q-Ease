import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

const SearchInput = ({ 
  value, 
  onChange, 
  onClear,
  onSubmit,
  placeholder = 'Search...', 
  className,
  showButton = false,
  buttonLabel = 'Search',
  ...props 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onClear?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "pl-10",
            value && "pr-10",
            showButton && "rounded-r-none"
          )}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showButton && (
        <Button type="submit" className="rounded-l-none absolute right-0 top-0">
          {buttonLabel}
        </Button>
      )}
    </form>
  );
};

export default SearchInput;
