import { z } from "zod";

export const stationSchema = z.object({
  code: z.string().min(1, "駅を選択してください"),
  name: z.string().min(1, "駅を選択してください"),
  lon: z.number(),
  lat: z.number(),
  lines: z.array(z.string()),
});

export const searchFormSchema = z.object({
  selectStations: z
    .array(stationSchema.nullable())
    .min(2, "最低2つの駅を選択してください")
    .max(5, "最大5つの駅まで選択できます")
    .refine(
      (stations) => stations.filter(Boolean).length >= 2,
      "最低2つの駅を選択してください",
    )
    .refine((stations) => {
      const codes = stations
        .filter((s): s is NonNullable<typeof s> => s !== null)
        .map((s) => s.code);

      return new Set(codes).size === codes.length;
    }, "同じ駅を複数選択することはできません"),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
