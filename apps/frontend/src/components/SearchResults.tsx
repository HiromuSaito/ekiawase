import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import orginalStations from "../constants/stations.json";
import { Station } from "../types";
import { findNearestStationsToMidpoint } from "../utils/findNearestStationsToMidpoint";

type Props = {};
export default function SearchResults({}: Props) {
  const [results, setResults] = useState<Station[]>([]);

  const navigate = useNavigate();
  const useQuery = () => {
    const location = useLocation();

    return location.search;
  };
  const search = useQuery();
  const codes = useMemo(() => {
    const params = new URLSearchParams(search);

    return params.getAll("codes");
  }, [search]);

  const stations = orginalStations.filter((s) =>
    codes.includes(s.code),
  ) as Station[];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (codes.length < 2 || codes.length > 5) {
      navigate("/");

      return;
    }

    const stations = findNearestStationsToMidpoint(codes, orginalStations);

    setResults(stations);
    setIsLoading(false);
  }, [codes, navigate]);

  return (
    <div className="w-full max-w-lg my-4">
      <p className="font-bold">検索結果</p>

      <div className="flex  items-center mb-4">
        <p className="text-sm text-gray-500">出発駅：</p>
        <div className="flex items-center">
          <span className="text-sm ">
            {stations.map((s) => s.name).join(", ")}
          </span>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : (
        <>
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>駅名</TableColumn>
              <TableColumn>路線</TableColumn>
            </TableHeader>
            <TableBody>
              <>
                {results.map((r) => (
                  <TableRow key={r.code}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.lines.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </>
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button
              color="default"
              size="sm"
              variant="bordered"
              onPress={() => navigate("/")}
            >
              入力画面に戻る
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
