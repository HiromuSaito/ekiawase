import { useState } from "react";

import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";

import DefaultLayout from "@/layouts/default";

import orginalStations from "../constants/stations.json"
import { Station } from "../types";

export default function IndexPage() {
  const stations: Station[] = orginalStations;
  const [isSearched, setIsSearched] = useState(false);

  return (
    <DefaultLayout>
      {!isSearched ? (
        <SearchForm
          stations={stations}
          search={() => setIsSearched(true)} />
      ) : (
        <SearchResults />
      )}
    </DefaultLayout>
  );
}
