
import { Search as SearchIcon, Loader2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({ searchQuery, setSearchQuery, isSearching, onSubmit }: SearchFormProps) => {
  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Pill className="h-5 w-5" />
          <span>Medicine Search</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter medicine name (e.g., Paracetamol, Aspirin, Amoxicillin)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg"
              disabled={isSearching}
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching}
            className="bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral hover:from-rxdecode-purple/90 hover:to-rxdecode-coral/90 px-6"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Popular searches: Paracetamol, Aspirin, Ibuprofen, Amoxicillin, Omeprazole</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
