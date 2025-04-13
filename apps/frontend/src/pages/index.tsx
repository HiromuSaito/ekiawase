import { useState } from "react";

import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const [isSearched, setIsSearched] = useState(false);

  return (
    <DefaultLayout>
      {!isSearched ? (
        <SearchForm search={() => setIsSearched(true)} />
      ) : (
        <SearchResults />
      )}
    </DefaultLayout>
  );
}
