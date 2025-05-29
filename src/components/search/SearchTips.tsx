
import { Card, CardContent } from '@/components/ui/card';

const SearchTips = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold font-bricolage mb-4 text-gray-800">
          Search Tips
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-rxdecode-purple rounded-full"></div>
            <span>Use the generic name of the medicine for better results</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-rxdecode-coral rounded-full"></div>
            <span>Check the spelling if no results are found</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-rxdecode-green rounded-full"></div>
            <span>Try alternative names or brand names</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-rxdecode-blue rounded-full"></div>
            <span>Always verify information with your healthcare provider</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SearchTips;
