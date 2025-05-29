
import { useSearch } from '@/hooks/useSearch';
import SearchForm from '@/components/search/SearchForm';
import MedicineInfoCard from '@/components/search/MedicineInfoCard';
import DisclaimerCard from '@/components/search/DisclaimerCard';
import SearchTips from '@/components/search/SearchTips';

const Search = () => {
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    medicineInfo,
    handleSearch
  } = useSearch();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-bricolage mb-4 bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral bg-clip-text text-transparent">
            Search Medicine
          </h1>
          <p className="text-lg text-gray-600">
            Enter a medicine name to get detailed information about usage, dosage, and precautions
          </p>
        </div>

        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          onSubmit={handleSearch}
        />

        {medicineInfo && (
          <div className="space-y-6 animate-fade-in">
            <MedicineInfoCard medicineInfo={medicineInfo} />
            <DisclaimerCard />
          </div>
        )}

        <SearchTips />
      </div>
    </div>
  );
};

export default Search;
