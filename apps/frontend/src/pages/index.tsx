import { useState } from "react";

import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import orginalStations from "../constants/stations.json";
import { Station } from "../types";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const stations: Station[] = orginalStations;
  const [isSearched, setIsSearched] = useState(false);

  return (
    <DefaultLayout>
      {!isSearched ? (
        <SearchForm search={() => setIsSearched(true)} stations={stations} />
      ) : (
        <SearchResults />
      )}
    </DefaultLayout>
  );
}
