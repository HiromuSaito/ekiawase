import { Fragment, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Station } from "../types";
import stations from "../constants/stations.json";
import { searchFormSchema, type SearchFormValues } from "../schemas/station";

import { StationCombobox } from "./StationCombobox";

export default function SearchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      selectStations: [
        { code: "", name: "", lon: 0, lat: 0 },
        { code: "", name: "", lon: 0, lat: 0 },
      ],
    },
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectStations",
  });

  const onSubmit = (data: SearchFormValues) => {
    setIsLoading(true);
    const codes = data.selectStations
      .filter((s): s is Station => s !== null)
      .map((s) => s.code);
    const params = new URLSearchParams();

    codes.forEach((code) => {
      params.append("codes", code);
    });

    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-lg my-4">
      <div className="w-full">
        <form className="space-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            const error = errors.selectStations?.[index]?.code;

            return (
              <Fragment key={field.id}>
                <div className="flex items-end w-space-x-2 w-full">
                  <div className="flex flex-col w-full">
                    <p className="text-xs mb-1">出発駅{index + 1}</p>
                    <Controller
                      control={control}
                      name={`selectStations.${index}`}
                      render={({ field }) => (
                        <StationCombobox
                          pageSize={10}
                          selectedItem={field.value ?? undefined}
                          setSelectedItem={(item: Station | undefined) => {
                            field.onChange(item ?? null);
                          }}
                          stations={stations}
                        />
                      )}
                    />

                    {error && (
                      <p className="text-xs text-red-500 mt-1">
                        {error.message}
                      </p>
                    )}
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
          {errors.selectStations?.root && (
            <p className="text-xs text-red-500">
              {errors.selectStations.root.message}
            </p>
          )}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button
              className="disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
              color="default"
              disabled={fields.length >= 5}
              size="sm"
              variant="bordered"
              onPress={() => {
                append({ code: "", name: "", lon: 0, lat: 0, lines: [] });
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
