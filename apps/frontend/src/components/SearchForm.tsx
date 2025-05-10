import { Fragment, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Station } from "../types";
import stations from "../constants/stations.json";

import { StationCombobox } from "./StationCombobox";

type FormValues = {
  selectStations: (Station | null)[];
};

export default function SearchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      selectStations: [
        { code: "", name: "", lon: 0, lat: 0 },
        { code: "", name: "", lon: 0, lat: 0 },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectStations",
  });

  const onSubmit = (_data: FormValues) => {
    setIsLoading(true);
    const codes = _data.selectStations
      .filter((s) => s != null)
      .map((s) => s.code)
      .filter((code) => code);
    const params = new URLSearchParams();

    codes.forEach((code) => {
      params.append("codes", code);
    });

    setTimeout(() => {
      navigate(`/result?${params.toString()}`);
    }, 1000);
  };

  return (
    <div className="w-full max-w-lg my-4">
      <div className="w-full">
        <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            const selected = watch(`selectStations.${index}`) as Station | null;

            return (
              <Fragment key={field.id}>
                <div className="flex items-end w-space-x-2 w-full">
                  <div className="flex flex-col w-full">
                    <p className="text-xs mb-1">出発駅{index + 1}</p>

                    <StationCombobox
                      pageSize={10}
                      selectedItem={selected ?? undefined}
                      setSelectedItem={(item: Station | undefined) => {
                        setValue(`selectStations.${index}`, item ?? null);
                      }}
                      stations={stations}
                    />
                  </div>

                  {fields.length > 2 && (
                    <Button
                      className="bg-white hover:bg-gray-200 py-2"
                      size="sm"
                      onPress={() => remove(index)}
                    >
                      <Trash2 className="back hover:text-red-500" color="red" />
                    </Button>
                  )}
                </div>
              </Fragment>
            );
          })}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button
              color="default"
              size="sm"
              variant="bordered"
              onPress={() => {
                append(null);
              }}
            >
              出発駅を追加
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              size="sm"
              type="submit"
            >
              {isLoading ? "検索中..." : "検索"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
