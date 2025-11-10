import { GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { fetchWastebins } from "../ApiClient";

export interface Wastebin {
    id: number;
    address: string;
    emptyingSchedule: string;
    lastEmptiedAt: string;
    userId: number;
}

type ValidationResult = { issues: { message: string; path: (keyof Wastebin)[] }[] };

export function validate(wastebin: Partial<Wastebin>): ValidationResult {
    let issues: ValidationResult['issues'] = [];

    if (!wastebin.address) {
        issues = [...issues, { message: 'Address is required', path: ['address'] }];
    }
    return { issues };
}